import variables from 'config/variables';
import { useState } from 'react';
import { FileUpload } from 'components/Form/Settings';
import { MdCloudUpload } from 'react-icons/md';
import { importSettings as importSettingsFunction } from 'modules/helpers/settings/modals';
import { Header } from '../components/Layout';
import default_settings from 'modules/default_settings.json';

function ImportSettings(props) {
  const [importedSettings, setImportedSettings] = useState([]);

  const importSettings = (e) => {
    importSettingsFunction(e);

    const settings = [];
    const data = JSON.parse(e.target.result);
    Object.keys(data).forEach((setting) => {
      // language and theme already shown, the others are only used internally
      if (
        setting === 'language' ||
        setting === 'theme' ||
        setting === 'firstRun' ||
        setting === 'showWelcome' ||
        setting === 'showReminder'
      ) {
        return;
      }

      const defaultSetting = default_settings.find((i) => i.name === setting);
      if (defaultSetting !== undefined) {
        if (data[setting] === String(defaultSetting.value)) {
          return;
        }
      }

      settings.push({
        name: setting,
        value: data[setting],
      });
    });

    setImportedSettings(settings);
    props.switchTab(5);
  };
  return (
    <>
      <Header
        title={variables.getMessage('modals.welcome.sections.settings.title')}
        subtitle={variables.getMessage('modals.welcome.sections.settings.description')}
      />
      <button className="upload" onClick={() => document.getElementById('file-input').click()}>
        <MdCloudUpload />
        <span>{variables.getMessage('modals.main.settings.buttons.import')}</span>
      </button>
      <FileUpload
        id="file-input"
        accept="application/json"
        type="settings"
        loadFunction={(e) => importSettings(e)}
      />
      <span className="title">{variables.getMessage('modals.welcome.tip')}</span>
      <span className="subtitle">
        {variables.getMessage('modals.welcome.sections.settings.tip')}
      </span>
    </>
  );
}

export { ImportSettings as default, ImportSettings };
