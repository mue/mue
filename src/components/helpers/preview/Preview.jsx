import variables from 'modules/variables';

import './preview.scss';

export default function Preview(props) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <div className='preview-mode'>
      <h3>{getMessage('modals.main.settings.reminder.title')}</h3>
      <h1>{getMessage('modals.welcome.preview.description')}</h1>
      <button className='uploadbg' onClick={() => props.setup()}>{getMessage('modals.welcome.preview.continue')}</button>
    </div>
  );
}
