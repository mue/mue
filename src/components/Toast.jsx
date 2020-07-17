//* Imports
import React from 'react';
import FileCopy from '@material-ui/icons/AttachFile';

export default class Toast extends React.Component {
  render() {
    return (
        <div id='toast'>
        <FileCopy className="copyButton"/>
        <hr />
       Quote Copied!
      </div>
    );
  }
}