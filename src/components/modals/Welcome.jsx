import React from 'react';
import EmailIcon from '@material-ui/icons/Email';
import TwitterIcon from '@material-ui/icons/Twitter';
import ForumIcon from '@material-ui/icons/Forum';

export default class Welcome extends React.PureComponent {
  render() {
    return (
      <div className='welcomeContent'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <div className='welcomeModalText'>
          <h2 className='subtitle'>{this.props.language.title}</h2>
          <h1 className='welcometitle'>Mue Tab</h1>
          <img alt='celebration' style={{ 'height': '200px', 'width': 'auto' }} draggable={false} src='./././icons/undraw_celebration.svg' />
          <h2 className='subtitle'>{this.props.language.information}</h2>
          <p>{this.props.language.thankyoumessage1},<br/> {this.props.language.thankyoumessage2}</p>
          <h2 className='subtitle'>{this.props.language.support}</h2>
          <a href='mailto:hello@muetab.com' className='welcomeLink' target='_blank' rel='noreferrer'><EmailIcon/></a>
          <a href='https://twitter.com/getmue' className='welcomeLink' target='_blank' rel='noreferrer'><TwitterIcon/></a>
          <a href='https://discord.gg/zv8C9F8' className='welcomeLink' target='_blank' rel='noreferrer'><ForumIcon/></a>
          <br/>
          <button className='close' onClick={this.props.modalClose}>{this.props.language.close}</button>
        </div>
       </div>
      );
    }
}