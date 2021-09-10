import variables from 'modules/variables';

export default function KeybindInput(props) {
  const value = props.state[props.setting];

  const getButton = () => {
    if (!value) {
      return null;
    } else if (value === variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.recording')) {
      return <span className='modalLink' onClick={() => props.action('cancel', props.setting)}>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.advanced.reset_modal.cancel')}</span>
    } else {
      return <span className='modalLink' onClick={() => props.action('reset', props.setting)}>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.buttons.reset')}</span>;
    }
  }

  return (
    <>
      <p>{props.name}</p>
      <input type='text' onClick={() => props.action('listen', props.setting)} value={value || variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.click_to_record')} readOnly/>
      {getButton()}
    </>
  );
}
