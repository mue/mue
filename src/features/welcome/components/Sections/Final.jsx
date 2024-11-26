import variables from 'config/variables';
import { Header, Content } from '../Layout';
import defaults from 'config/default';

function Final(props) {
  const language = localStorage.getItem('language') || defaults.language;
  const theme = localStorage.getItem('theme') || defaults.theme;

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
            {new Intl.DisplayNames([language], { type: 'language' }).of(language)}
          </span>
        </div>
        <div className="toggle" onClick={() => props.switchTab(3)}>
          <span>
            {variables.getMessage('settings:sections.appearance.theme.title')}:{' '}
            {variables.getMessage(
              'settings:sections.appearance.theme.' + theme,
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
