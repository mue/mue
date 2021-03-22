import React from 'react';

import SettingsFunctions from '../../../../modules/helpers/settings';

import CheckboxUI from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Checkbox extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      checked: (localStorage.getItem(this.props.name) === 'true')
    };
  }

  handleChange() {
    SettingsFunctions.setItem(this.props.name);

    this.setState({
      checked: (this.state.checked === true) ? false : true
    });
  }

  render() {
    let text = this.props.text;

    if (this.props.newFeature) {
      text = <span>{this.props.text} <span className='newFeature'> NEW</span></span>;
    } else if (this.props.betaFeature) {
      text = <span>{this.props.text} <span className='newFeature'> BETA</span></span>;
    }

    return (
      <>
        <FormControlLabel
          control={<CheckboxUI name={this.props.name} color='primary' checked={this.state.checked} onChange={() => this.handleChange()} />}
          label={text}
        />
        <br/>
      </>
    );
  }
}
