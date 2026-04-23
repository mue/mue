import { useT } from 'contexts';
import languages from '@/i18n/languages.json';
import { Header, Content } from '../Layout';

function Final(props) {
  const t = useT();
  return (
    <Content>
      <Header
        title={t('modals.welcome.sections.final.title')}
        subtitle={t('modals.welcome.sections.final.description')}
      />
      <span className="title">{t('modals.welcome.sections.final.changes')}</span>
      <span className="subtitle">{t('modals.welcome.sections.final.changes_description')}</span>
      <div className="themesToggleArea themesToggleAreaWelcome">
        <div className="toggle" onClick={() => props.switchTab(1)}>
          <span>
            {t('modals.main.settings.sections.language.title')}:{' '}
            {languages.find((i) => i.value === localStorage.getItem('language')).name}
          </span>
        </div>
        <div className="toggle" onClick={() => props.switchTab(3)}>
          <span>
            {t('modals.main.settings.sections.appearance.theme.title')}:{' '}
            {t('modals.main.settings.sections.appearance.theme.' + localStorage.getItem('theme'))}
          </span>
        </div>
        {props.importedSettings.length !== 0 && (
          <div className="toggle" onClick={() => props.switchTab(2)}>
            {t('modals.welcome.sections.final.imported', {
              amount: props.importedSettings.length,
            })}{' '}
          </div>
        )}
      </div>
    </Content>
  );
}

export { Final as default, Final };
