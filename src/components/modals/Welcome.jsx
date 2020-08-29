import React from 'react';
import EmailIcon from '@material-ui/icons/Email';

export default class Welcome extends React.PureComponent {
  render() {
    return <div className='welcomeContent'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <div className="welcomeModalText">
          <h2 className="subtitle">Welcome to</h2>
          <h1 className="welcometitle">Mue Tab</h1>
          <img alt="celebration" style={{"height": "200px", "width": "auto"}} src="./././icons/undraw_celebration.svg" />
          <h2 className="subtitle">Information</h2>
          <p>Thank you for downloading Mue Tab,<br/> we hope you enjoy your time with our extension.</p>
          <h2 className="subtitle">Tutorials</h2>
          <a href=''>General Start</a>
          <br/>
          <a href='https://blog.muetab.xyz/welcome-to-marketplace/'>Marketplace</a>
          <br/>
          <a href=''>Submitting Photos</a>
          <br/>
          <a href=''>Settings</a>
          <h2 className="subtitle">Support</h2>
         {/* <img alt="twitter" href="https://twitter.com/getmue" className="icon" src=""/>
          <img alt="discord" href="https://discord.gg/kJsufA9" className="icon" src=""/> */}
          <EmailIcon />
          <br/>
          <button className="close" onClick={this.props.modalClose}>Close</button>
        </div>
      </div>;
    }
}