import React from 'react';

import EventBus from '../../../../modules/helpers/eventbus';

import RadioUI from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default class Radio extends React.PureComponent {
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

    localStorage.setItem(this.props.name, value);
  
    this.setState({
      value: value
    });

    window.analytics.postEvent('setting', `${this.props.name} from ${this.state.value} to ${value}`);

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
