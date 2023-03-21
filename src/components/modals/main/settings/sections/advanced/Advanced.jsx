import variables from 'modules/variables';
import { PureComponent } from 'react';
import Modal from 'react-modal';
import { MenuItem } from '@mui/material';
import {
  MdUpload as ImportIcon,
  MdDownload as ExportIcon,
  MdRestartAlt as ResetIcon,
  /* MdDataUsage, */
  /* MdOutlineKeyboardArrowRight, */
} from 'react-icons/md';

import { exportSettings, importSettings } from 'modules/helpers/settings/modals';

import FileUpload from '../../FileUpload';
import Text from '../../Text';
import Switch from '../../Switch';
import ResetModal from '../../ResetModal';
import Dropdown from '../../Dropdown';
import SettingsItem from '../../SettingsItem';

//import Data from './Data';

import time_zones from 'components/widgets/time/timezones.json';

export default class AdvancedSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      resetModal: false,
      showData: false,
    };
  }

  render() {
    /*if (this.state.showData) {
      return <Data goBack={() => this.setState({ showData: false })} />;
    }*/

    return (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.main.settings.sections.advanced.title')}
        </span>
        {/* {localStorage.getItem('welcomePreview') !== 'true' ? (
          <div className="moreSettings" onClick={() => this.setState({ showData: true })}>
            <div className="left">
              <MdDataUsage />
              <div className="content">
                <span className="title">
                  {variables.getMessage('modals.main.settings.sections.advanced.data')}
                </span>
                <span className="subtitle">
                  Sync, export, import etc your data. You have control, this is Mue.
                </span>
              </div>
            </div>
            <div className="action">
              {' '}
              <MdOutlineKeyboardArrowRight />
            </div>
          </div>
        ) : null} */}
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.advanced.offline_mode')}
          subtitle={variables.getMessage('modals.main.settings.sections.advanced.offline_subtitle')}
        >
          <Switch name="offlineMode" element=".other" />
        </SettingsItem>
        {localStorage.getItem('welcomePreview') !== 'true' ? (
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
              <button onClick={() => this.setState({ resetModal: true })}>
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
        ) : null}
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.advanced.timezone.title')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.advanced.timezone.subtitle',
          )}
        >
          <Dropdown name="timezone" category="timezone" manual={true}>
            <MenuItem value="auto">
              {variables.getMessage('modals.main.settings.sections.advanced.timezone.automatic')}
            </MenuItem>
            {time_zones.map((timezone) => (
              <MenuItem value={timezone} key={timezone}>
                {timezone}
              </MenuItem>
            ))}
          </Dropdown>
        </SettingsItem>
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.advanced.tab_name')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.advanced.tab_name_subtitle',
          )}
        >
          <Text name="tabName" default={variables.getMessage('tabname')} category="other" />
        </SettingsItem>
        <FileUpload
          id="file-input"
          accept="application/json"
          type="settings"
          loadFunction={(e) => importSettings(e)}
        />
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.advanced.custom_css')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.advanced.custom_css_subtitle',
          )}
        >
          <Text name="customcss" textarea={true} category="other" customcss={true} />
        </SettingsItem>
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.experimental.title')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.advanced.experimental_warning',
          )}
          final={true}
        >
          <Switch
            name="experimental"
            text={variables.getMessage('modals.main.settings.enabled')}
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
