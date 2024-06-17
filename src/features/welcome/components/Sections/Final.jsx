import variables from 'config/variables';
import languages from '@/i18n/languages.json';
import { Header, Content } from '../Layout';
import defaults from 'config/default';

function Final(props) {
  return (
    <Content>
      <Header
        title={variables.getMessage('welcome:sections.final.title')}
        subtitle={variables.getMessage('welcome:sections.final.description')}
      />
      <span className="title">{variables.getMessage('welcome:sections.final.changes')}</span>
      <span className="subtitle">
        {variables.getMessage('welcome:sections.final.changes_description')}
      </span>
      <div className="themesToggleArea themesToggleAreaWelcome">
        <div className="toggle" onClick={() => props.switchTab(1)}>
          <span>
            {variables.getMessage('settings:sections.language.title')}:{' '}
            {languages.find((i) => i.value === localStorage.getItem('language') || defaults.language).name}
          </span>
        </div>
        <div className="toggle" onClick={() => props.switchTab(3)}>
          <span>
            {variables.getMessage('settings:sections.appearance.theme.title')}:{' '}
            {variables.getMessage(
              'settings:sections.appearance.theme.' + localStorage.getItem('theme'),
            )}
          </span>
        </div>
        {props.importedSettings.length !== 0 && (
          <div className="toggle" onClick={() => props.switchTab(2)}>
            {variables.getMessage('welcome:sections.final.imported', {
              amount: props.importedSettings.length,
            })}{' '}
          </div>
        )}
      </div>
    </Content>
  );
}

export { Final as default, Final };
