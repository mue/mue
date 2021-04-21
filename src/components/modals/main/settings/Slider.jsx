import React from 'react';

import EventBus from '../../../../modules/helpers/eventbus';

import { toast } from 'react-toastify';

export default class Slider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || ''
    };
    this.language = window.language.modals.main.settings;
  }

  handleChange = (e) => {
    const { value } = e.target;
  
    localStorage.setItem(this.props.name, value);
    this.setState({
      value: value
    });

    EventBus.dispatch('refresh', this.props.category);
  }

  resetItem = () => {
    localStorage.setItem(this.props.name, this.props.default);
    this.setState({
      value: this.props.default
    });

    toast(window.language.toasts.reset);
    EventBus.dispatch('refresh', this.props.category);
  }

  render() {
    return (
      <>
        <p>{this.props.title} ({this.state.value}{this.props.display}) <span className='modalLink' onClick={this.resetItem}>{this.language.buttons.reset}</span></p>
        <input className='range' type='range' min={this.props.min} max={this.props.max} step={this.props.step || 1} value={this.state.value} onChange={this.handleChange} />
      </>
    );
  }
}
