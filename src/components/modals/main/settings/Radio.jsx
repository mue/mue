import variables from 'modules/variables';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Radio as RadioUI,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

import EventBus from 'modules/helpers/eventbus';
import { translations } from 'modules/translations';

class Radio extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name),
    };
  }

  handleChange = async (e) => {
    const { value } = e.target;

    if (value === 'loading') {
      return;
    }

    if (this.props.name === 'language') {
      // old tab name
      if (localStorage.getItem('tabName') === variables.getMessage('tabname')) {
        localStorage.setItem('tabName', translations[value.replace('-', '_')].tabname);
      }
    }

    localStorage.setItem(this.props.name, value);

    this.setState({
      value,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    variables.stats.postEvent('setting', `${this.props.name} from ${this.state.value} to ${value}`);

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', this.props.category);
  };

  render() {
    return (
      <FormControl component="fieldset">
        <FormLabel
          className={this.props.smallTitle ? 'radio-title-small' : 'radio-title'}
          component="legend"
        >
          {this.props.title}
        </FormLabel>
        <RadioGroup
          aria-label={this.props.name}
          name={this.props.name}
          onChange={this.handleChange}
          value={this.state.value}
        >
          {this.props.options.map((option) => (
            <FormControlLabel
              value={option.value}
              control={<RadioUI />}
              label={option.name}
              key={option.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }
}

Radio.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  category: PropTypes.string,
  element: PropTypes.string,
  smallTitle: PropTypes.bool,
};

export default Radio;
