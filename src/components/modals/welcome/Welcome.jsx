import React from 'react';

import EmailIcon from '@material-ui/icons/Email';
import TwitterIcon from '@material-ui/icons/Twitter';
import ForumIcon from '@material-ui/icons/Forum';

import './welcome.scss';

export default function WelcomeModal(props) {
  const language = window.language.modals.welcome;

  return (
    <div className='welcomeContent'>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <div className='welcomeModalText'>
        <h2 className='subtitle'>{language.title}</h2>
        <h1 className='welcometitle'>Mue Tab</h1>
        <img alt='celebration' style={{ 'height': '200px', 'width': 'auto' }} draggable={false} src='./././icons/undraw_celebration.svg' />
        <h2 className='subtitle'>{language.information}</h2>
        <p>{language.thankyoumessage1},<br/> {language.thankyoumessage2}</p>
        <h2 className='subtitle'>{language.support}</h2>
        <a href='mailto:hello@muetab.com' className='welcomeLink' target='_blank' rel='noopener noreferrer'><EmailIcon/></a>
        <a href='https://twitter.com/getmue' className='welcomeLink' target='_blank' rel='noopener noreferrer'><TwitterIcon/></a>
        <a href='https://discord.gg/zv8C9F8' className='welcomeLink' target='_blank' rel='noopener noreferrer'><ForumIcon/></a>
        <br/>
        <button className='close' onClick={props.modalClose}>{language.close}</button>
      </div>
    </div>
  );
}
