import variables from 'config/variables';
import { FileUpload } from 'components/Form/Settings';
import { MdCloudUpload } from 'react-icons/md';
import { importSettings as importSettingsFunction } from 'utils/settings';
import { Header, Content } from '../Layout';

function ImportSettings(props) {
  const importSettings = (e) => {
    importSettingsFunction(e, true);

    const settings = [];
    const data = JSON.parse(e);
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

      settings.push({
        name: setting,
        value: data[setting],
      });
    });

    props.setImportedSettings(settings);
    props.switchTab(6);
  };
  return (
    <Content>
      <Header
        title={variables.getMessage('welcome:sections.settings.title')}
        subtitle={variables.getMessage('welcome:sections.settings.description')}
      />
      <button className="upload" onClick={() => document.getElementById('file-input').click()}>
        <MdCloudUpload />
        <span>{variables.getMessage('settings:buttons.import')}</span>
      </button>
      <FileUpload
        id="file-input"
        accept="application/json"
        type="settings"
        loadFunction={(e) => importSettings(e)}
      />
      <span className="title">{variables.getMessage('welcome:tip')}</span>
      <span className="subtitle">{variables.getMessage('welcome:sections.settings.tip')}</span>
    </Content>
  );
}

export { ImportSettings as default, ImportSettings };
