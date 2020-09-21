import React from 'react';
import SettingsFunctions from '../../../modules/settingsFunctions';

export default class Slider extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      checked: (localStorage.getItem(this.props.name) === 'true')
    };
  }

  handleChange(name) {
    SettingsFunctions.setItem(name);
    this.setState({ checked: (this.state.checked === true) ? false : true });
  }

  render() {
    let setText = (this.props.override) ? this.props.override : this.props.name;
    return (
        <label className='switch'>
          <input type='checkbox' checked={this.state.checked} onChange={() => this.handleChange(setText)} />
          <span className='slider'></span>
        </label>
    );
  }
}