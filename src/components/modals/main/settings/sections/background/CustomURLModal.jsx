import { useState } from 'react';
import { Add } from '@mui/icons-material';
import { TextField } from '@mui/material'; 

export default function CustomURLModal({ modalClose }) {
  const [url, setURL] = useState('URL');

  return (
    <>
      <h1>Add URL</h1>
      <TextField value={url} onChange={(e) => setURL(e.target.value)} varient='outlined' />
      <div className='resetfooter'>
        <button className='round import' style={{ marginLeft: '5px' }} onClick={() => modalClose(url)}>
          <Add/>
        </button>
      </div>
    </>
  );
}
