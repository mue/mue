import React from 'react';

import { toast } from 'react-toastify';

export default class Slider extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      value: localStorage.getItem(this.props.name) || ''
    };
    this.language = window.language.modals.main.settings;
  }

  handleChange(value) {
    localStorage.setItem(this.props.name, value);
    this.setState({
      value: value
    });
  }

  resetItem() {
    localStorage.setItem(this.props.name, this.props.default);
    this.setState({
      value: this.props.default
    });

    toast(this.language.toasts.reset);
  }

  render() {
    return (
      <>
        <p>{this.props.title} ({this.state.value}{this.props.display}) <span className='modalLink' onClick={() => this.resetItem()}>{this.language.buttons.reset}</span></p>
        <input className='range' type='range' min={this.props.min} max={this.props.max} value={this.state.value} onChange={(e) => this.handleChange(e.target.value)} />
      </>
    );
  }
}
