import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import EventBus from 'modules/helpers/eventbus';

export default class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || this.props.children[0].props.value,
      title: '',
    };
    this.dropdown = createRef();
  }

  onChange = (e) => {
    const { value } = e.target;

    if (value === variables.language.getMessage(variables.languagecode, 'modals.main.loading')) {
      return;
    }

    variables.stats.postEvent('setting', `${this.props.name} from ${this.state.value} to ${value}`);

    this.setState({
      value,
    });

    if (!this.props.noSetting) {
      localStorage.setItem(this.props.name, value);
    }

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.dispatch('refresh', this.props.category);
  };

  render() {
    const id = 'dropdown' + this.props.name;
    const label = this.props.label || '';

    return (
      <FormControl fullWidth className={id}>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          labelId={id}
          id={this.props.name}
          value={this.state.value}
          label={label}
          onChange={this.onChange}
          ref={this.dropdown}
          key={id}
        >
          {this.props.manual
            ? this.props.children
            : this.props.children.map((e, index) => {
                return e ? (
                  <MenuItem key={index} value={e.props ? e.props.value : ''}>
                    {e.props ? e.props.children : ''}
                  </MenuItem>
                ) : null;
              })}
        </Select>
      </FormControl>
    );
  }
}
