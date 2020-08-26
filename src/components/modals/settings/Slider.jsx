import React from 'react';
import SettingsFunctions from '../../../modules/settingsFunctions';

export default class Slider extends React.PureComponent {
  render() {
    let setText = this.props.name;
    if (this.props.override) setText = this.props.override;
    return (
        <label className="switch">
          <input type="checkbox" onClick={() => SettingsFunctions.setItem(setText)} id={this.props.name + 'Status'}  />
          <span className="slider"></span>
        </label>
    );
  }
}