import React from 'react';
import SettingsFunctions from '../../../modules/settingsFunctions';
import CheckboxUI from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Checkbox extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      checked: true
    };
  }

  handleChange(name) {
    SettingsFunctions.setItem(name);
    this.setState({ checked: (this.state.checked === true) ? false : true });
  }

  componentDidMount() {
    this.setState({ checked: (localStorage.getItem(this.props.name) === 'true') });
  }

  render() {
    return (
      <React.Fragment>
        <FormControlLabel
          control={<CheckboxUI name='checkedB' color='primary' checked={this.state.checked} onChange={() => this.handleChange(this.props.name)} />}
          label={this.props.text}
        />
        <br/>
      </React.Fragment>
    );
  }
}