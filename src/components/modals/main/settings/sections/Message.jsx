import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdCancel, MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { TextField, TextareaAutosize } from '@mui/material';
import SettingsItem from '../SettingsItem';

import Header from '../Header';

import EventBus from 'modules/helpers/eventbus';

export default class Message extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      messages: JSON.parse(localStorage.getItem('messages')) || [''],
    };
  }

  reset = () => {
    localStorage.setItem('messages', '[""]');
    this.setState({
      messages: [''],
    });
    toast(this.getMessage(this.languagecode, 'toasts.reset'));
    EventBus.dispatch('refresh', 'message');
  };

  modifyMessage(type, index) {
    const messages = this.state.messages;
    if (type === 'add') {
      messages.push(' ');
    } else {
      messages.splice(index, 1);
    }

    this.setState({
      messages,
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
  }

  message(e, text, index) {
    const result = text === true ? e.target.value : e.target.result;

    const messages = this.state.messages;
    messages[index] = result;
    this.setState({
      messages,
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  }

  render() {
    return (
      <>
        <Header
          title={this.getMessage('modals.main.settings.sections.message.title')}
          setting="message"
          category="message"
          element=".message"
          zoomSetting="zoomMessage"
          switch={true}
        />
        <SettingsItem
          title={this.getMessage('modals.main.settings.sections.message.text')}
          subtitle=""
          final={true}
        >
          <button onClick={() => this.modifyMessage('add')}>
            {this.getMessage('modals.main.settings.sections.message.add')} <MdAdd />
          </button>
        </SettingsItem>
        <table style={{ width: '100%' }}>
          <tr>
            <th>Messages</th>
            <th>Buttons</th>
          </tr>
          {this.state.messages.map((_url, index) => (
            <tr>
              <th>
                <TextareaAutosize
                  value={this.state.messages[index]}
                  placeholder="Message"
                  onChange={(e) => this.message(e, true, index)}
                  varient="outlined"
                />
              </th>
              <th>
                {this.state.messages.length > 1 ? (
                  <button
                    className="deleteButton"
                    onClick={() => this.modifyMessage('remove', index)}
                  >
                    <MdCancel />
                  </button>
                ) : null}
              </th>
            </tr>
          ))}
        </table>
        <br />
      </>
    );
  }
}
