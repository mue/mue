import React from 'react';
import SettingsFunctions from '../../../modules/settingsFunctions';
import CheckboxUI from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Checkbox extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
        checked: true
    }
  }

  render() {
    const handleChange = () => {
      SettingsFunctions.setItem(this.props.name);
      let checked;
      if (this.state.checked === true) checked = false;
      else checked = true;
      this.setState({ checked: checked });
    }

    let value = localStorage.getItem(this.props.name);
    this.setState({ checked: (value === 'true') });

    return (
      <React.Fragment>
        <FormControlLabel
          control={<CheckboxUI name="checkedB" color="primary" checked={this.state.checked} onChange={handleChange} />}
          label={this.props.text}
        />
        <br/>
      </React.Fragment>
    );
  }
}