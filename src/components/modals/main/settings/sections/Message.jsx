import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdCancel, MdAdd, MdOutlineTextsms } from 'react-icons/md';
import { toast } from 'react-toastify';
import { TextareaAutosize } from '@mui/material';

import SettingsItem from '../SettingsItem';
import Header from '../Header';

import EventBus from 'modules/helpers/eventbus';

export default class Message extends PureComponent {
  constructor() {
    super();
    this.state = {
      messages: JSON.parse(localStorage.getItem('messages')) || [],
    };
  }

  reset = () => {
    localStorage.setItem('messages', '[]');
    this.setState({
      messages: [],
    });
    toast(variables.getMessage(this.languagecode, 'toasts.reset'));
    EventBus.emit('refresh', 'message');
  };

  modifyMessage(type, index) {
    const messages = this.state.messages;
    if (type === 'add') {
      messages.push('');
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
          title={variables.getMessage('modals.main.settings.sections.message.title')}
          setting="message"
          category="message"
          element=".message"
          zoomSetting="zoomMessage"
          switch={true}
        />
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.message.messages')}
          final={true}
        >
          <button onClick={() => this.modifyMessage('add')}>
            {variables.getMessage('modals.main.settings.sections.message.add')} <MdAdd />
          </button>
        </SettingsItem>
        <div className="messagesContainer">
          {this.state.messages.map((_url, index) => (
            <div className="messageMap" key={index}>
              <div className="flexGrow">
                <div className="icon">
                  <MdOutlineTextsms />
                </div>
                <div className="messageText">
                  <span className="subtitle">
                    {variables.getMessage('modals.main.settings.sections.message.title')}
                  </span>
                  <TextareaAutosize
                    value={this.state.messages[index]}
                    placeholder={variables.getMessage(
                      'modals.main.settings.sections.message.content',
                    )}
                    onChange={(e) => this.message(e, true, index)}
                    varient="outlined"
                    style={{ padding: '0' }}
                  />
                </div>
              </div>
              <div>
                <div className="messageAction">
                  <button
                    className="deleteButton"
                    onClick={() => this.modifyMessage('remove', index)}
                  >
                    {variables.getMessage('modals.main.marketplace.product.buttons.remove')}
                    <MdCancel />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {this.state.messages.length === 0 ? (
          <div className="photosEmpty">
            <div className="emptyNewMessage">
              <MdOutlineTextsms />
              <span className="title">
                {variables.getMessage('modals.main.settings.sections.message.no_messages')}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.message.add_some')}
              </span>
              <button onClick={() => this.modifyMessage('add')}>
                {variables.getMessage('modals.main.settings.sections.message.add')}
                <MdAdd />
              </button>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
