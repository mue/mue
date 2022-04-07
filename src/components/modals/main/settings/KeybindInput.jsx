import variables from 'modules/variables';
import { MdCancel } from 'react-icons/md';
import { TextField } from '@mui/material';

export default function KeybindInput(props) {
  const value = props.state[props.setting];

  const getButton = () => {
    if (!value) {
      return <button className='cleanButton' style={{ visibility: 'hidden' }} onClick={() => props.action('reset', props.setting)}><Cancel/></button>;;
    } else if (value === variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.recording')) {
      return <button className='cleanButton' onClick={() => props.action('cancel', props.setting)}><MdCancel/></button>;
    } else {
      return <button className='cleanButton' onClick={() => props.action('reset', props.setting)}><MdCancel/></button>;
    }
  }

  return (
    <>
      <TextField label={props.name} onClick={() => props.action('listen', props.setting)} value={value || variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.keybinds.click_to_record')} readOnly spellCheck={false} varient='outlined' InputLabelProps={{ shrink: true }} />
      {getButton()}
    </>
  );
}
