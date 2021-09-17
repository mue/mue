import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import { Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';

import Switch from '../Switch';
import Slider from '../Slider';

import EventBus from 'modules/helpers/eventbus';

export default class Message extends PureComponent {
  getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  languagecode = variables.languagecode;

  constructor() {
    super();
    this.state = {
      messages: JSON.parse(localStorage.getItem('messages')) || [''],
    };
  }

  reset = () => {
    localStorage.setItem('messages', '[""]');
    this.setState({
      messages: ['']
    });
    toast(this.getMessage(this.languagecode, 'toasts.reset'));
    EventBus.dispatch('refresh', 'message');
  }

  modifyMessage(type, index) {
    const messages = this.state.messages;
    if (type === 'add') {
      messages.push('');
    } else {
      messages.splice(index, 1);
    }

    this.setState({
      messages
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
  }

  message(e, text, index) {
    const result = (text === true) ? e.target.value : e.target.result;

    const messages = this.state.messages;
    messages[index] = result;
    this.setState({
      messages
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
    document.querySelector('.reminder-info').style.display = 'block';
    localStorage.setItem('showReminder', true);
  }
  
  render() {
    return (
      <>
        <h2>{this.getMessage(this.languagecode, 'modals.main.settings.sections.message.title')}</h2>
        <Switch name='message' text={this.getMessage(this.languagecode, 'modals.main.settings.enabled')} category='message' element='.message'/>
        <p>{this.getMessage(this.languagecode, 'modals.main.settings.sections.message.text')}</p>
        {this.state.messages.map((_url, index) => (
          <Fragment key={index}>
            <input type='text' value={this.state.messages[index]} onChange={(e) => this.message(e, true, index)}></input>
            {this.state.messages.length > 1 ? <button className='cleanButton' onClick={() => this.modifyMessage('remove', index)}>
              <Cancel/>
            </button> : null}
            <br/><br/>
          </Fragment>
        ))}
        <button className='uploadbg' onClick={() => this.modifyMessage('add')}>{this.getMessage(this.languagecode, 'modals.main.settings.sections.message.add')}</button>
        <Slider title={this.getMessage(this.languagecode, 'modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomMessage' min='10' max='400' default='100' display='%' category='message' />
      </>
    );
  }
}
