import variables from 'config/variables';
import { useState } from 'react';
import Modal from 'react-modal';
import {
  MdUpload as ImportIcon,
  MdDownload as ExportIcon,
  MdRestartAlt as ResetIcon,
  MdDataUsage,
  MdError,
  MdBrush,
} from 'react-icons/md';

import { exportSettings, importSettings } from 'utils/settings';

import { FileUpload, Text, Switch, Dropdown } from 'components/Form/Settings';
import { ResetModal, Button } from 'components/Elements';

import {
  Header,
  Section,
  Row,
  Content,
  Action,
  PreferencesWrapper,
} from 'components/Layout/Settings';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';

import time_zones from 'features/time/timezones.json';

function AdvancedOptions() {
  const [resetModal, setResetModal] = useState(false);
  const [data, setData] = useState(false);
  const ADVANCED_SECTION = 'settings:sections.advanced';
  const { subSection } = useTab();

  const Data = () => {
    return localStorage.getItem('welcomePreview') !== 'true' ? (
      <Row final={true}>
        <Content
          title={variables.getMessage('settings:sections.advanced.data')}
          subtitle={variables.getMessage('settings:sections.advanced.data_description')}
        />
        <div className="resetDataButtonsLayout">
          <Button
            onClick={() => setResetModal(true)}
            icon={<ResetIcon />}
            label={variables.getMessage('settings:buttons.reset')}
          />
          <Button
            onClick={() => exportSettings()}
            icon={<ExportIcon />}
            label={variables.getMessage('settings:buttons.export')}
          />
          <Button
            onClick={() => document.getElementById('file-input').click()}
            icon={<ImportIcon />}
            label={variables.getMessage('settings:buttons.import')}
          />
        </div>
        <FileUpload
          id="file-input"
          accept="application/json"
          type="settings"
          loadFunction={(e) => importSettings(e)}
        />
      </Row>
    ) : (
      <div className="emptyItems">
        <div className="emptyMessage">
          <div className="loaderHolder">
            <MdError />

            <span className="title">
              {variables.getMessage('settings:sections.advanced.preview_data_disabled.title')}
            </span>
            <span className="subtitle">
              {variables.getMessage('settings:sections.advanced.preview_data_disabled.description')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  let header;
  if (data) {
    header = (
      <Header
        title={variables.getMessage(`${ADVANCED_SECTION}.title`)}
        secondaryTitle={variables.getMessage(`${ADVANCED_SECTION}.data`)}
        goBack={() => setData(false)}
        report={false}
      />
    );
  } else {
    header = <Header title={variables.getMessage(`${ADVANCED_SECTION}.title`)} report={false} />;
  }

  return (
    <>
      {/*{header}*/}
      {subSection === 'data' && (
        <>
          <Data />
          <Modal
            closeTimeoutMS={100}
            onRequestClose={() => setResetModal(false)}
            isOpen={resetModal}
            className="Modal resetmodal mainModal"
            overlayClassName="Overlay resetoverlay"
            ariaHideApp={false}
          >
            <ResetModal modalClose={() => setResetModal(false)} />
          </Modal>
        </>
      )}
      {subSection === 'custom-css' && (
        <PreferencesWrapper>
          <span className="text-3xl font-semibold tracking-tight">
            {variables.getMessage('settings:sections.advanced.custom_css')}
          </span>
          <Text name="customcss" textarea={true} category="other" customcss={true} />
        </PreferencesWrapper>
      )}
      {subSection === '' && (
        <>
          <Section
            id="data"
            title={variables.getMessage(`${ADVANCED_SECTION}.data`)}
            subtitle={variables.getMessage(`${ADVANCED_SECTION}.data_subtitle`)}
            icon={<MdDataUsage />}
          />
          <Section
            id="custom-css"
            title={variables.getMessage('settings:sections.advanced.custom_css')}
            subtitle={variables.getMessage('settings:sections.advanced.custom_css_subtitle')}
            icon={<MdBrush />}
          />
          <PreferencesWrapper>
            <Row>
              <Content
                title={variables.getMessage('settings:sections.advanced.offline_mode')}
                subtitle={variables.getMessage('settings:sections.advanced.offline_subtitle')}
              />
              <Action>
                <Switch name="offlineMode" element=".other" />
              </Action>
            </Row>

            <Row>
              <Content
                title={variables.getMessage('settings:sections.advanced.timezone.title')}
                subtitle={variables.getMessage('settings:sections.advanced.timezone.subtitle')}
              />
              <Action>
                <Dropdown
                  name="timezone"
                  category="timezone"
                  items={[
                    {
                      value: 'auto',
                      text: variables.getMessage('settings:sections.advanced.timezone.automatic'),
                    },
                    ...time_zones.map((timezone) => ({ value: timezone, text: timezone })),
                  ]}
                />
              </Action>
            </Row>
            <Row>
              <Content
                title={variables.getMessage('settings:sections.advanced.tab_name')}
                subtitle={variables.getMessage('settings:sections.advanced.tab_name_subtitle')}
              />
              <Action>
                <Text name="tabName" default={variables.getMessage('tabname')} category="other" />
              </Action>
            </Row>
            <Row final={true}>
              <Content
                title={variables.getMessage('settings:sections.experimental.title')}
                subtitle={variables.getMessage('settings:sections.advanced.experimental_warning')}
              />
              <Action>
                <Switch
                  name="experimental"
                  text={variables.getMessage('settings:enabled')}
                  element=".other"
                />
              </Action>
            </Row>
          </PreferencesWrapper>
        </>
      )}
    </>
  );
}

export { AdvancedOptions as default, AdvancedOptions };
