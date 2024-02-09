import variables from 'modules/variables';
import { useState } from 'react';
import Modal from 'react-modal';
import { MenuItem } from '@mui/material';
import {
  MdUpload as ImportIcon,
  MdDownload as ExportIcon,
  MdRestartAlt as ResetIcon,
  MdOutlineKeyboardArrowRight,
  MdDataUsage,
} from 'react-icons/md';

import { exportSettings, importSettings } from 'modules/helpers/settings/modals';

import FileUpload from '../FileUpload';
import Text from '../Text';
import Switch from '../Switch';
import ResetModal from '../ResetModal';
import Dropdown from '../Dropdown';

import { Row, Content, Action } from '../SettingsItem';
import Section from '../Section';

import time_zones from 'components/widgets/time/timezones.json';

export default function AdvancedSettings() {
  const [resetModal, setResetModal] = useState(false);
  const [data, setData] = useState(false);
  const ADVANCED_SECTION = 'modals.main.settings.sections.advanced';

  const Data = () => {
    return (
      <>
        {localStorage.getItem('welcomePreview') !== 'true' && (
          <div className="settingsRow">
            <div className="content">
              <span className="title">
                {variables.getMessage('modals.main.settings.sections.advanced.data')}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.advanced.data_subtitle')}
              </span>
            </div>
            <div className="action activityButtons">
              <button onClick={() => setResetModal(true)}>
                {variables.getMessage('modals.main.settings.buttons.reset')}
                <ResetIcon />
              </button>
              <button onClick={() => exportSettings()}>
                {variables.getMessage('modals.main.settings.buttons.export')}
                <ExportIcon />
              </button>
              <button onClick={() => document.getElementById('file-input').click()}>
                {variables.getMessage('modals.main.settings.buttons.import')}
                <ImportIcon />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  let header;
  if (data) {
    header = (
      <span className="mainTitle">
        <span className="backTitle" onClick={() => setData(false)}>
          {variables.getMessage(`${ADVANCED_SECTION}.title`)}
        </span>
        <MdOutlineKeyboardArrowRight />
        {variables.getMessage(`${ADVANCED_SECTION}.data`)}
      </span>
    );
  } else {
    header = (
      <span className="mainTitle"> {variables.getMessage(`${ADVANCED_SECTION}.title`)}</span>
    );
  }

  return (
    <>
      {header}
      {data ? (
        <Data />
      ) : (
        <>
          <Section
            title={variables.getMessage(`${ADVANCED_SECTION}.data`)}
            subtitle={variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.description',
            )}
            onClick={() => setData(true)}
            icon={<MdDataUsage />}
          />
          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.offline_mode')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.offline_subtitle',
              )}
            />
            <Action>
              <Switch name="offlineMode" element=".other" />
            </Action>
          </Row>

          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.timezone.title')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.timezone.subtitle',
              )}
            />
            <Action>
              <Dropdown name="timezone" category="timezone" manual={true}>
                <MenuItem value="auto">
                  {variables.getMessage(
                    'modals.main.settings.sections.advanced.timezone.automatic',
                  )}
                </MenuItem>
                {time_zones.map((timezone) => (
                  <MenuItem value={timezone} key={timezone}>
                    {timezone}
                  </MenuItem>
                ))}
              </Dropdown>
            </Action>
          </Row>
          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.tab_name')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.tab_name_subtitle',
              )}
            />
            <Action>
              <Text name="tabName" default={variables.getMessage('tabname')} category="other" />
            </Action>
          </Row>
          <FileUpload
            id="file-input"
            accept="application/json"
            type="settings"
            loadFunction={(e) => importSettings(e)}
          />
          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.custom_css')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.custom_css_subtitle',
              )}
            />
            <Action>
              <Text name="customcss" textarea={true} category="other" customcss={true} />
            </Action>
          </Row>
          <Row final={true}>
            <Content
              title={variables.getMessage('modals.main.settings.sections.experimental.title')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.experimental_warning',
              )}
            />
            <Action>
              <Switch
                name="experimental"
                text={variables.getMessage('modals.main.settings.enabled')}
                element=".other"
              />
            </Action>
          </Row>
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
    </>
  );
}
