import { PureComponent } from 'react';
import { Radio as RadioUI, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';

import EventBus from 'modules/helpers/eventbus';

export default class Radio extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name)
    };
  }
  
  handleChange = (e) => {
    const { value } = e.target;

    if (value === 'loading') {
      return;
    }

    if (this.props.name === 'language') {
      // old tab name
      if (localStorage.getItem('tabName') === window.language.tabname) {
        localStorage.setItem('tabName', require(`../../../../translations/${value.replace('-', '_')}.json`).tabname);
      }
    }

    localStorage.setItem(this.props.name, value);
  
    this.setState({
      value
    });

    window.stats.postEvent('setting', `${this.props.name} from ${this.state.value} to ${value}`);
    
    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'block';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.dispatch('refresh', this.props.category);
  }
  
  render() {
    return (
      <FormControl component='fieldset'>
        <FormLabel className={this.props.smallTitle ? 'radio-title-small' : 'radio-title'} component='legend'>{this.props.title}</FormLabel>
        <RadioGroup aria-label={this.props.name} name={this.props.name} onChange={this.handleChange} value={this.state.value}>
          {this.props.options.map((option) => (
            <FormControlLabel value={option.value} control={<RadioUI/>} label={option.name} key={option.name} />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }
}
