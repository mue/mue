import React from 'react';

import SettingsFunctions from '../../../modules/helpers/settings';

export default class Slider extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      checked: (localStorage.getItem(this.props.name) === 'true')
    };
  }

  handleChange() {
    let setText = (this.props.override) ? this.props.override : this.props.name;

    SettingsFunctions.setItem(setText);

    this.setState({ 
      checked: (this.state.checked === true) ? false : true 
    });
  }

  render() {
    return (
        <label className='switch'>
          <input type='checkbox' checked={this.state.checked} onChange={() => this.handleChange()} />
          <span className='slider'></span>
        </label>
    );
  }
}