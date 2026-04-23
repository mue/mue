import { useT } from 'contexts';
import { FileUpload } from 'components/Form/Settings';
import { MdCloudUpload } from 'react-icons/md';
import { importSettings as importSettingsFunction } from 'utils/settings';
import { Header, Content } from '../Layout';
import default_settings from 'utils/data/default_settings.json';

function ImportSettings(props) {
  const t = useT();
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

    props.setImportedSettings(settings);
    props.switchTab(6);
  };
  return (
    <Content>
      <Header
        title={t('modals.welcome.sections.settings.title')}
        subtitle={t('modals.welcome.sections.settings.description')}
      />
      <button className="upload" onClick={() => document.getElementById('file-input').click()}>
        <MdCloudUpload />
        <span>{t('modals.main.settings.buttons.import')}</span>
      </button>
      <FileUpload
        id="file-input"
        accept="application/json"
        type="settings"
        loadFunction={(e) => importSettings(e)}
      />
      <span className="title">{t('modals.welcome.tip')}</span>
      <span className="subtitle">{t('modals.welcome.sections.settings.tip')}</span>
    </Content>
  );
}

export { ImportSettings as default, ImportSettings };
