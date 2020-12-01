import React from 'react';
import Section from '../Section';
import Checkbox from '../Checkbox';
import DatePicker from 'react-date-picker';
import { toast } from 'react-toastify';

export default class GreetingSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
        birthday: new Date(localStorage.getItem('birthday')) || new Date()
    };
  }

  resetItem() {
    document.getElementById('greetingName').value = '';
    toast(this.props.toastLanguage.reset);
  }

  changeDate(data) {
      if (data === 'reset') return; //soon
      localStorage.setItem('birthday', data);
      this.setState({ birthday: data });
  }

  componentDidMount() {
    document.getElementById('greetingName').value = localStorage.getItem('greetingName');
  }

  render() {
    return (
        <Section title={this.props.language.greeting.title} name='greeting'>
        <Checkbox name='events' text={this.props.language.greeting.events} />
        <Checkbox name='defaultGreetingMessage' text={this.props.language.greeting.default} />
        <Checkbox name='birthdayenabled' text='Birthday Enabled' />
        <ul>
          <p>{this.props.language.greeting.name} <span className='modalLink' onClick={() => this.resetItem()}>{this.props.language.reset}</span></p>
          <input type='text' id='greetingName'></input>
        </ul>
        <ul>
          <p>Birthday Date</p>
          <DatePicker onChange={(data) => this.changeDate(data)} value={this.state.birthday}/>
        </ul>
      </Section>
    );
  }
}