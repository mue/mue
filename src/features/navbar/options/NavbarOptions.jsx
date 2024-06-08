import variables from 'config/variables';

import { useState, memo } from 'react';

import { MdAssignment, MdCropFree, MdRefresh, MdChecklist, MdOutlineApps } from 'react-icons/md';

import { Checkbox, Dropdown } from 'components/Form';
import EventBus from 'utils/eventbus';

import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { Header } from 'components/Layout/Settings';

import AppsOptions from './AppsOptions';

function NavbarOptions() {
  const [showRefreshOptions, setShowRefreshOptions] = useState(
    localStorage.getItem('refresh') === 'true',
  );
  const [appsEnabled, setAppsEnabled] = useState(localStorage.getItem('appsEnabled') === 'true' || false);

  const NAVBAR_SECTION = 'modals.main.settings.sections.appearance.navbar';

  const AdditionalSettings = () => {
    return (
      <Row final={false}>
        <Content
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.navbar.additional',
          )}
        />
        <Action>
          <Checkbox
            name="navbarHover"
            text={variables.getMessage(`${NAVBAR_SECTION}.hover`)}
            category="navbar"
          />
        </Action>
      </Row>
    );
  };

  const NavbarOptions = () => {
    const NavbarButton = ({ icon, messageKey, settingName }) => {
      const [isDisabled, setIsDisabled] = useState(localStorage.getItem(settingName) !== 'true');
      const handleClick = () => {
        localStorage.setItem(settingName, isDisabled);

        if (settingName === 'refresh') {
          setShowRefreshOptions(!showRefreshOptions);
        } else if (settingName === 'appsEnabled') {
          setAppsEnabled(!appsEnabled);
        }

        setIsDisabled(!isDisabled);

        variables.stats.postEvent(
          'setting',
          `${settingName} ${!isDisabled === true ? 'enabled' : 'disabled'}`,
        );

        EventBus.emit('refresh', 'navbar');
      };

      return (
        <button
          onClick={handleClick}
          className={`navbarButtonOption ${isDisabled === true ? 'disabled' : ''}`}
        >
          {icon}
          <span className="subtitle">{variables.getMessage(messageKey)}</span>
        </button>
      );
    };

    const buttons = [
      {
        icon: <MdCropFree />,
        settingName: 'view',
        messageKey: 'modals.main.settings.sections.background.buttons.view',
      },
      {
        icon: <MdAssignment />,
        settingName: 'notesEnabled',
        messageKey: `${NAVBAR_SECTION}.notes`,
      },
      {
        icon: <MdChecklist />,
        settingName: 'todoEnabled',
        messageKey: 'widgets.navbar.todo.title',
      },
      {
        icon: <MdRefresh />,
        settingName: 'refresh',
        messageKey: `${NAVBAR_SECTION}.refresh`,
      },
      {
        icon: <MdOutlineApps />,
        settingName: 'appsEnabled',
        messageKey: 'widgets.navbar.apps.title',
      },
    ];

    return (
      <Row>
        <Content
          title={variables.getMessage('modals.main.settings.sections.appearance.navbar.widgets')}
        />
        <Action>
          <div className="navbarButtonOptions">
            {buttons.map((button, index) => (
              <NavbarButton key={index} {...button} />
            ))}
          </div>
        </Action>
      </Row>
    );
  };

  const RefreshOptions = () => {
    return (
      <Row final={false} inactive={!showRefreshOptions}>
        <Content
          title={variables.getMessage(`${NAVBAR_SECTION}.refresh`)}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.navbar.refresh_subtitle',
          )}
        />
        <Action>
          <Dropdown
            name="refreshOption"
            category="navbar"
            items={[
              {
                value: 'page',
                text: variables.getMessage(
                  'modals.main.settings.sections.appearance.navbar.refresh_options.page',
                ),
              },
              {
                value: 'background',
                text: variables.getMessage('modals.main.settings.sections.background.title'),
              },
              {
                value: 'quote',
                text: variables.getMessage('modals.main.settings.sections.quote.title'),
              },
              {
                value: 'quotebackground',
                text:
                  variables.getMessage('modals.main.settings.sections.quote.title') +
                  ' + ' +
                  variables.getMessage('modals.main.settings.sections.background.title'),
              },
            ]}
          />
        </Action>
      </Row>
    );
  };

  return (
    <>
      <Header
        title={variables.getMessage(`${NAVBAR_SECTION}.title`)}
        setting="navbar"
        category="widgets"
        zoomSetting="zoomNavbar"
        zoomCategory="navbar"
      />
      <AdditionalSettings />
      <NavbarOptions />
      <RefreshOptions />
      <AppsOptions appsEnabled={appsEnabled} />
    </>
  );
}

const MemoizedNavbarOptions = memo(NavbarOptions);

export { MemoizedNavbarOptions as default, MemoizedNavbarOptions as NavbarOptions };
