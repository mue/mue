import variables from 'modules/variables';
import SettingsItem from '../../SettingsItem';
import { PureComponent } from 'react';
import {
  MdOutlineKeyboardArrowRight,
  MdUpload as ImportIcon,
  MdDownload as ExportIcon,
  MdRestartAlt as ResetIcon,
  MdOutlineSync,
} from 'react-icons/md';

export default class Data extends PureComponent {
  render() {
    return (
      <>
        <span className="mainTitle" onClick={() => this.props.goBack()}>
          {variables.getMessage('modals.main.settings.sections.advanced.title')}
          <MdOutlineKeyboardArrowRight /> Data
        </span>
        <div
          className="moreSettings"
          style={{
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            gap: '10px',
            padding: '30px',
          }}
        >
          <MdOutlineSync />
          <span className="title">Sync</span>
          {/*<span className='subtitle'>Last synced at: Sun 10:12PM, 1st May 2022</span>*/}
          <span className="subtitle">Sync is not setup yet.</span>
        </div>
        <div className="settingsRow">
          <div className="content">
            <span className="title">
              {variables.getMessage('modals.main.settings.sections.advanced.data')}
            </span>
            <span className="subtitle">
              Choose whether to export your Mue settings to your computer, import an existing
              settings file, or reset your settings to their default values.
            </span>
          </div>
          <div className="action activityButtons">
            <button>
              {variables.getMessage('modals.main.settings.buttons.reset')}
              <ResetIcon />
            </button>
            <button>
              {variables.getMessage('modals.main.settings.buttons.export')}
              <ExportIcon />
            </button>
            <button>
              {variables.getMessage('modals.main.settings.buttons.import')}
              <ImportIcon />
            </button>
          </div>
        </div>
        <SettingsItem title="Sync" subtitle="Setup sync to sync lol"></SettingsItem>
      </>
    );
  }
}
