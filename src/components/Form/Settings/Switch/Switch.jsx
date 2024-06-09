import variables from 'config/variables';
import { PureComponent } from 'react';
//import { Switch as SwitchUI, FormControlLabel } from '@mui/material';
import { Field, Label, Switch as SwitchUI } from '@headlessui/react';

import EventBus from 'utils/eventbus';

class Switch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: localStorage.getItem(this.props.name) === 'true',
    };
  }

  handleChange = () => {
    const value = this.state.checked !== true;
    localStorage.setItem(this.props.name, value);

    this.setState({
      checked: value,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    variables.stats.postEvent(
      'setting',
      `${this.props.name} ${this.state.checked === true ? 'enabled' : 'disabled'}`,
    );

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
      {
        /*<FormControlLabel
        control={
          <SwitchUI
            name={this.props.name}
            color="primary"
            checked={this.state.checked}
            onChange={this.handleChange}
          />
        }
        label={this.props.header ? '' : this.props.text}
        labelPlacement="start"
      />*/
      },
      (
        <Field className="flex flex-row items-center justify-between w-[100%]">
          <Label>{this.props.header ? '' : this.props.text}</Label>
          <SwitchUI
            checked={this.state.checked}
            onChange={this.handleChange}
            className="box-border group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
          >
            {' '}
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </SwitchUI>
        </Field>
      )
    );
  }
}

export { Switch as default, Switch };
