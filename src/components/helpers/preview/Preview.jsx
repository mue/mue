import variables from 'modules/variables';
import './preview.scss';

export default function Preview(props) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <div className="preview-mode">
      <span className="title">{getMessage('modals.main.settings.reminder.title')}</span>
      <span className="subtitle">{getMessage('modals.welcome.preview.description')}</span>
      <button onClick={() => props.setup()}>{getMessage('modals.welcome.preview.continue')}</button>
    </div>
  );
}
