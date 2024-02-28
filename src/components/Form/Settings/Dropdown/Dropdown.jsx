import variables from 'config/variables';
import { PureComponent, createRef } from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import EventBus from 'utils/eventbus';

class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || this.props.items[0].value,
      title: '',
    };
    this.dropdown = createRef();
  }

  onChange = (e) => {
    const { value } = e.target;

    if (value === variables.getMessage('modals.main.loading')) {
      return;
    }

    variables.stats.postEvent('setting', `${this.props.name} from ${this.state.value} to ${value}`);

    this.setState({
      value,
    });

    if (!this.props.noSetting) {
      localStorage.setItem(this.props.name, value);
      localStorage.setItem(this.props.name2, this.props.value2);
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

    EventBus.emit('refresh', this.props.category);
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
          {this.props.items.map((item) =>
            item !== null ? (
              <MenuItem key={id + item.value} value={item.value}>
                {item.text}
              </MenuItem>
            ) : null,
          )}
        </Select>
      </FormControl>
    );
  }
}

export { Dropdown as default, Dropdown };
