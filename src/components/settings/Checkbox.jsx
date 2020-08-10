import React from 'react';
import * as SettingsFunctions from '../../modules/settingsFunctions';

export default class Checkbox extends React.PureComponent {
  render() {
    return (
        <ul>
            <input name={this.props.name} type="checkbox" onClick={() => SettingsFunctions.setItem(this.props.name)} id={this.props.name + 'Status'} />
            <label htmlFor={this.props.name}>{this.props.text}</label>
        </ul>
    );
  }
}