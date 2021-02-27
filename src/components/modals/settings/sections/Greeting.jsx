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

    toast(this.props.toastLanguage.reset);
  }

  changeDate(data) {
      if (data === 'reset') {
        return; //soon
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
    return (
      <div>
        <h2>Greeting</h2>
        <Checkbox name='events' text={this.props.language.greeting.events} />
        <Checkbox name='defaultGreetingMessage' text={this.props.language.greeting.default} />
        <Checkbox name='birthdayenabled' text={this.props.language.greeting.birthday_enabled} />
        <ul>
          <p>{this.props.language.greeting.name} <span className='modalLink' onClick={() => this.resetItem()}>{this.props.language.reset}</span></p>
          <input type='text' value={this.state.greetingName} onChange={(e) => this.setState({ greetingName: e.target.value })}></input>
        </ul>
        <ul>
          <p>{this.props.language.greeting.birthday_date}</p>
          <DatePicker onChange={(data) => this.changeDate(data)} value={this.state.birthday}/>
        </ul>
      </div>
    );
  }
}