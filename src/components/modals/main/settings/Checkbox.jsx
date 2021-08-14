import { PureComponent } from 'react';

import EventBus from '../../../../modules/helpers/eventbus';

import CheckboxUI from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Checkbox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: (localStorage.getItem(this.props.name) === 'true')
    };
  }

  handleChange = () => {
    const value = (this.state.checked === true) ? false : true;
    localStorage.setItem(this.props.name, value);

    this.setState({
      checked: value
    });

    window.stats.postEvent('setting', `${this.props.name} ${(this.state.checked === true) ? 'enabled' : 'disabled'}`);

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'block';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.dispatch('refresh', this.props.category);
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
          control={<CheckboxUI name={this.props.name} color='primary' className='checkbox' checked={this.state.checked} onChange={this.handleChange} />}
          label={text}
        />
        <br/>
      </>
    );
  }
}
