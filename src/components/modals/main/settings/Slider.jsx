import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { Slider } from '@mui/material';

import EventBus from 'modules/helpers/eventbus';

export default class SliderComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || this.props.default
    };
  }

  handleChange = (e, text) => {
    let { value } = e.target;
    value = Number(value);

    if (text) {
      if (value === '') {
        return this.setState({
          value: 0
        });
      }

      if (value > this.props.max) {
        value = this.props.max;
      }
  
      if (value < this.props.min) {
        value = this.props.min;
      }
    }
  
    localStorage.setItem(this.props.name, value);
    this.setState({
      value
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
    toast(variables.language.getMessage(variables.languagecode, 'toasts.reset'));
  }

  render() {
    return (
      <>
        <p>{this.props.title}<span className='modalLink' onClick={this.resetItem}>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.buttons.reset')}</span></p>
        <Slider 
          value={Number(this.state.value)} 
          onChange={this.handleChange} 
          valueLabelDisplay='auto' 
          default={Number(this.props.default)} 
          min={Number(this.props.min)} 
          max={Number(this.props.max)} 
          step={this.props.step || 1} 
          getAriaValueText={(value) => `${value}`} 
          marks={this.props.marks || []}
        />
      </>
    );
  }
}
