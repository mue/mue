import React from 'react';

import Checkbox from '../Checkbox';

import DatePicker from 'react-date-picker';
import { toast } from 'react-toastify';

export default class GreetingSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      birthday: new Date(localStorage.getItem('birthday')) || new Date(),
      greetingName: localStorage.getItem('greetingName') || ''
    };
  }

  resetItem() {
    this.setState({
      greetingName: ''
    });

    toast(this.props.language.toasts.reset);
  }

  changeDate(data) {
    //soon
    if (data === 'reset') {
      return;
    }

    localStorage.setItem('birthday', data);

    this.setState({
      birthday: data
    });
  }

  componentDidUpdate() {
    localStorage.setItem('greetingName', this.state.greetingName);
  }

  render() {
    const { greeting } = this.props.language.sections;

    return (
      <div>
        <h2>{greeting.title}</h2>
        <Checkbox name='greeting' text={this.props.language.enabled} />
        <Checkbox name='events' text={greeting.events} />
        <Checkbox name='defaultGreetingMessage' text={greeting.default} />
        <ul>
          <p>{greeting.name} <span className='modalLink' onClick={() => this.resetItem()}>{this.props.language.buttons.reset}</span></p>
          <input type='text' value={this.state.greetingName} onChange={(e) => this.setState({ greetingName: e.target.value })}></input>
        </ul>

        <h3>{greeting.birthday}</h3>
        <Checkbox name='birthdayenabled' text={this.props.language.enabled} />
        <ul>
          <p>{greeting.birthday_date}</p>
          <DatePicker onChange={(data) => this.changeDate(data)} value={this.state.birthday}/>
        </ul>
      </div>
    );
  }
}
