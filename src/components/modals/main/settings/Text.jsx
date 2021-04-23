import React from 'react';

import EventBus from '../../../../modules/helpers/eventbus';

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
    let { value } = e.target;
  
    // Alex wanted font to work with montserrat and Montserrat, so I made it work
    if (this.props.upperCaseFirst === true) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    localStorage.setItem(this.props.name, value);
    this.setState({
      value: value
    });

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'block';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.dispatch('refresh', this.props.category);
  }

  resetItem = () => {
    localStorage.setItem(this.props.name, this.props.default || '');
    this.setState({
      value: this.props.default || ''
    });

    toast(window.language.toasts.reset);
    EventBus.dispatch('refresh', this.props.category);
  }

  render() {
    return (
      <>
        <p>{this.props.title} <span className='modalLink' onClick={this.resetItem}>{this.language.buttons.reset}</span></p>
        {(this.props.textarea === true) ? 
          <textarea className='settingsTextarea' spellCheck={false} value={this.state.value} onChange={this.handleChange}/>
          : <input type='text' value={this.state.value} onChange={this.handleChange}/>
        }
      </>
    );
  }
}
