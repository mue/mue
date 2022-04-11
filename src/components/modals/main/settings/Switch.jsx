import variables from 'modules/variables';
import { PureComponent } from 'react';
import { Switch as SwitchUI, FormControlLabel } from '@mui/material';

import EventBus from 'modules/helpers/eventbus';

export default class Switch extends PureComponent {
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

    EventBus.dispatch('refresh', this.props.category);
  };

  render() {
    return (
      <>
        <FormControlLabel
          control={
            <SwitchUI
              name={this.props.name}
              color="primary"
              checked={this.state.checked}
              onChange={this.handleChange}
            />
          }
          label={this.props.text}
          labelPlacement="start"
        />
      </>
    );
  }
}
