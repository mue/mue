import variables from 'modules/variables';

import './preview.scss';

export default function Preview(props) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <div className='preview-mode'>
      <h1>{getMessage('modals.main.settings.reminder.title')}</h1>
      <p>{getMessage('modals.welcome.preview.description')}</p>
      <button className='pinNote' onClick={() => props.setup()}>{getMessage('modals.welcome.preview.continue')}</button>
    </div>
  );
}
