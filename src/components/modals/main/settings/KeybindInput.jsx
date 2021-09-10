import variables from 'modules/variables';

export default function KeybindInput(props) {
  const value = props.state[props.settingsName];

  const getButton = () => {
    if (!value) {
      return null;
    } else if (value === variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.recording')) {
      return <span className='modalLink' onClick={() => props.cancel(props.settingsName)}>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.advanced.reset_modal.cancel')}</span>
    } else {
      return <span className='modalLink' onClick={() => props.reset(props.settingsName)}>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.buttons.reset')}</span>;
    }
  }

  return (
    <>
      <p>{props.name}</p>
      <input type='text' onClick={() => props.set(props.settingsName)} value={value || variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.click_to_record')} readOnly/>
      {getButton()}
    </>
  );
}
