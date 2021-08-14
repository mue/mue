// todo: find a better method to do width of number input
import { PureComponent } from 'react';

import EventBus from '../../../../modules/helpers/eventbus';

import { toast } from 'react-toastify';

export default class Slider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || this.props.default,
      numberWidth: localStorage.getItem(this.props.name) ? ((localStorage.getItem(this.props.name).length + 1) * ((this.props.toast === true) ? 7.75 : 7)) : 32
    };
    this.language = window.language.modals.main.settings;
    this.widthCalculation = (this.props.toast === true) ? 7.75 : 7;
  }

  handleChange = (e, text) => {
    let { value } = e.target;

    if (text) {
      if (value === '') {
        return this.setState({
          value: 0
        });
      }

      if (Number(value) > this.props.max) {
        value = this.props.max;
      }
  
      if (Number(value) < this.props.min) {
        value = this.props.min;
      }
    }
  
    localStorage.setItem(this.props.name, value);
    this.setState({
      value: value,
      numberWidth: ((value.length + 1) * this.widthCalculation)
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
    this.handleChange({
      target: {
        value: this.props.default || ''
      }
    });
    toast(window.language.toasts.reset);
  }

  render() {
    const text = <input className='sliderText' type='number' min={this.props.min} max={this.props.max} onChange={(e) => this.handleChange(e, 'text')} value={this.state.value} style={{ width: this.state.numberWidth }}/>;

    return (
      <>
        <p>{this.props.title} ({text}{this.props.display}) <span className='modalLink' onClick={this.resetItem}>{this.language.buttons.reset}</span></p>
        <input className='range' type='range' min={this.props.min} max={this.props.max} step={this.props.step || 1} value={this.state.value} onChange={this.handleChange} />
      </>
    );
  }
}
