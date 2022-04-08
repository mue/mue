import variables from 'modules/variables';

export default function SettingsItem(props) {
  /*const getMessage = (text) => variables.language.getMessage(variables.languageCode, text);*/
  return (
    <div className={props.final ? 'settingsRow settingsNoBorder' : 'settingsRow'}>
      <div className="content">
        <span className="title">{props.title}</span>
        <span className="subtitle">{props.subtitle}</span>
        {/*<span className='link'>{getMessage('modals.main.settings.buttons.reset')}</span>*/}
      </div>
      <div className="action">{props.children}</div>
    </div>
  );
}
