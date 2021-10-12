import variables from 'modules/variables';
import { Cancel } from '@mui/icons-material';
import { TextField } from '@mui/material';

export default function KeybindInput(props) {
  const value = props.state[props.setting];

  const getButton = () => {
    if (!value) {
      return <button className='cleanButton' style={{ visibility: 'hidden' }} onClick={() => props.action('reset', props.setting)}><Cancel/></button>;;
    } else if (value === variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.recording')) {
      return <span className='modalLink' onClick={() => props.action('cancel', props.setting)}>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.advanced.reset_modal.cancel')}</span>
    } else {
      return <button className='cleanButton' onClick={() => props.action('reset', props.setting)}><Cancel/></button>;
    }
  }

  return (
    <>
      <p>{props.name}</p>
      <TextField onClick={() => props.action('listen', props.setting)} value={value || variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.click_to_record')} readOnly spellCheck={false} varient='outlined' />
      {getButton()}
    </>
  );
}
