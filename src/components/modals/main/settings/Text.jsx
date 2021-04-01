import React from 'react';

import { toast } from 'react-toastify';

export default class Text extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || ''
    };
    this.language = window.language.modals.main.settings;
  }

  handleChange = (e) => {
    const { value } = e.target;
  
    // Alex wanted font to work with montserrat and Montserrat, so I made it work
    if (this.props.upperCaseFirst === true) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    localStorage.setItem(this.props.name, value);
    this.setState({
      value: value
    });
  }

  resetItem = () => {
    localStorage.setItem(this.props.name, this.props.default || '');
    this.setState({
      value: this.props.default || ''
    });

    toast(this.language.toasts.reset);
  }

  render() {
    return (
      <>
        <p>{this.props.title} <span className='modalLink' onClick={this.resetItem}>{this.language.buttons.reset}</span></p>
        {(this.props.textarea === true) ? 
          <textarea className='settingsTextarea' value={this.state.value} onChange={this.handleChange}/>
          :<input type='text' value={this.state.value} onChange={this.handleChange}/>
        }
      </>
    );
  }
}
