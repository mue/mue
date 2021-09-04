export default function KeybindInput(props) {
  const language = window.language.modals.main.settings;

  const getButton = () => {
    const value = props.state[props.settingsName];
    if (!value) {
      return null;
    } else if (value === language.sections.keybinds.recording) {
      return <span className='modalLink' onClick={() => props.cancel(props.settingsName)}>{language.sections.advanced.reset_modal.cancel}</span>
    } else {
      return <span className='modalLink' onClick={() => props.reset(props.settingsName)}>{language.buttons.reset}</span>;
    }
  }

  return (
    <>
      <p>{props.name}</p>
      <input type='text' onClick={() => props.set(props.settingsName)} value={props.state[props.settingsName] || language.sections.keybinds.click_to_record} readOnly/>
      {getButton()}
    </>
  );
}
