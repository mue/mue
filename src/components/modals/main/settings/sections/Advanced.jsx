import variables from 'modules/variables';
import { PureComponent } from 'react';
import Modal from 'react-modal';
import { MenuItem } from '@mui/material';
import {
  MdUpload as ImportIcon,
  MdDownload as ExportIcon,
  MdRestartAlt as ResetIcon,
} from 'react-icons/md';

import { exportSettings, importSettings } from 'modules/helpers/settings/modals';

import Checkbox from '../Checkbox';
import FileUpload from '../FileUpload';
import Text from '../Text';
import Switch from '../Switch';
import ResetModal from '../ResetModal';
import Dropdown from '../Dropdown';
import SettingsItem from '../SettingsItem';

import time_zones from 'components/widgets/time/timezones.json';

export default class AdvancedSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      resetModal: false,
    };
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <span className="mainTitle">
          {getMessage('modals.main.settings.sections.advanced.title')}
        </span>
        <SettingsItem title={getMessage('modals.main.settings.sections.advanced.offline_mode')}>
          <Switch
            name="offlineMode"
            text={getMessage('modals.main.settings.sections.advanced.offline_mode')}
            element=".other"
          />
        </SettingsItem>
        {localStorage.getItem('welcomePreview') !== 'true' ? (
          <div className="settingsRow">
            <div className="content">
              <span className="title">
                {getMessage('modals.main.settings.sections.advanced.data')}
              </span>
              <span className="subtitle">
                {getMessage('modals.main.settings.sections.advanced.experimental_warning')}
              </span>
            </div>
            <div className="action activityButtons">
              <button onClick={() => this.setState({ resetModal: true })}>
                {getMessage('modals.main.settings.buttons.reset')}
                <ResetIcon />
              </button>
              <button onClick={() => exportSettings()}>
                {getMessage('modals.main.settings.buttons.export')}
                <ExportIcon />
              </button>
              <button onClick={() => document.getElementById('file-input').click()}>
                {getMessage('modals.main.settings.buttons.import')}
                <ImportIcon />
              </button>
            </div>
          </div>
        ) : null}
        <SettingsItem title={getMessage('modals.main.settings.sections.advanced.timezone.title')} subtitle='Choose a timezone from a list of hundreds instead of the automatic default.'>
          <Dropdown
            name="timezone"
            category="timezone"
            manual={true}
          >
            <MenuItem value="auto">
              {getMessage('modals.main.settings.sections.advanced.timezone.automatic')}
            </MenuItem>
            {time_zones.map((timezone) => (
              <MenuItem value={timezone} key={timezone}>
                {timezone}
              </MenuItem>
            ))}
          </Dropdown>
        </SettingsItem>
        <SettingsItem title={getMessage('modals.main.settings.sections.advanced.tab_name')}>
          <Text
            name="tabName"
            default={getMessage('tabname')}
            category="other"
          />
        </SettingsItem>
        <FileUpload
          id="file-input"
          accept="application/json"
          type="settings"
          loadFunction={(e) => importSettings(e)}
        />
        <SettingsItem title={getMessage('modals.main.settings.sections.advanced.custom_css')}>
          <Text
            title={getMessage('modals.main.settings.sections.advanced.custom_css')}
            name="customcss"
            textarea={true}
            category="other"
          />
        </SettingsItem>
        <SettingsItem
          title={getMessage('modals.main.settings.sections.experimental.title')}
          subtitle={getMessage('modals.main.settings.sections.advanced.experimental_warning')}
          final={true}
        >
          <Switch
            name="experimental"
            text={getMessage('modals.main.settings.enabled')}
            element=".other"
          />
        </SettingsItem>
        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ resetModal: false })}
          isOpen={this.state.resetModal}
          className="Modal resetmodal mainModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <ResetModal modalClose={() => this.setState({ resetModal: false })} />
        </Modal>
      </>
    );
  }
}
