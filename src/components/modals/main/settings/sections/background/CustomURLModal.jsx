import variables from 'modules/variables';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { TextField } from '@mui/material'; 

export default function CustomURLModal({ modalClose, modalCloseOnly }) {
  const [url, setURL] = useState();

  return (
    <>
      <span className='closeModal' onClick={modalCloseOnly}>&times;</span>
      <h1>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.background.source.add_url')}</h1>
      <TextField value={url} onChange={(e) => setURL(e.target.value)} varient='outlined'/>
      <div className='resetfooter'>
        <button className='round import' style={{ marginLeft: '5px' }} onClick={() => modalClose(url)}>
          <MdAdd/>
        </button>
      </div>
    </>
  );
}
