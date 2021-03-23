import React from 'react';

import SettingsFunctions from '../../../../modules/helpers/settings';

import CheckboxUI from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Checkbox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: (localStorage.getItem(this.props.name) === 'true')
    };
  }

  handleChange = () => {
    SettingsFunctions.setItem(this.props.name);

    this.setState({
      checked: (this.state.checked === true) ? false : true
    });
  }

  render() {
    let text = this.props.text;

    if (this.props.newFeature) {
      text = <>{this.props.text} <span className='newFeature'> NEW</span></>;
    } else if (this.props.betaFeature) {
      text = <>{this.props.text} <span className='newFeature'> BETA</span></>;
    }

    return (
      <>
        <FormControlLabel
          control={<CheckboxUI name={this.props.name} color='primary' checked={this.state.checked} onChange={this.handleChange} />}
          label={text}
        />
        <br/>
      </>
    );
  }
}
