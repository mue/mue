import variables from 'config/variables';
import { useState } from 'react';
import { MdCancel, MdAdd, MdOutlineTextsms } from 'react-icons/md';
import { toast } from 'react-toastify';
import { TextareaAutosize } from '@mui/material';

import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Button } from 'components/Elements';
import EventBus from 'utils/eventbus';

function MessageOptions() {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);

  const reset = () => {
    localStorage.setItem('messages', '[]');
    setMessages([]);
    toast(variables.getMessage('toasts.reset'));
    EventBus.emit('refresh', 'message');
  };

  const modifyMessage = (type, index) => {
    const messages = messages;
    if (type === 'add') {
      messages.push('');
    } else {
      messages.splice(index, 1);
    }

    setMessages(messages);
    localStorage.setItem('messages', JSON.stringify(messages));
  };

  const message = (e, text, index) => {
    const result = text === true ? e.target.value : e.target.result;

    const messages = messages;
    messages[index] = result;
    setMessages(messages);

    localStorage.setItem('messages', JSON.stringify(messages));
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  };

  return (
    <>
      <Header
        title={variables.getMessage('settings:sections.message.title')}
        setting="message"
        category="message"
        element=".message"
        zoomSetting="zoomMessage"
        visibilityToggle={true}
      />
      <PreferencesWrapper
        setting="message"
        visibilityToggle={true}
        category="message"
        zoomSetting="zoomMessage"
      >
        <Row final={true}>
          <Content title={variables.getMessage('settings:sections.message.messages')} />
          <Action>
            <Button
              type="settings"
              onClick={() => modifyMessage('add')}
              icon={<MdAdd />}
              label={variables.getMessage('settings:sections.message.add')}
            />
          </Action>
        </Row>
        <div className="messagesContainer">
          {messages.map((_url, index) => (
            <div className="messageMap" key={index}>
              <div className="flexGrow">
                <div className="icon">
                  <MdOutlineTextsms />
                </div>
                <div className="messageText">
                  <span className="subtitle">
                    {variables.getMessage('settings:sections.message.title')}
                  </span>
                  <TextareaAutosize
                    value={messages[index]}
                    placeholder={variables.getMessage(
                      'settings:sections.message.content',
                    )}
                    onChange={(e) => message(e, true, index)}
                    varient="outlined"
                    style={{ padding: '0' }}
                  />
                </div>
              </div>
              <div>
                <div className="messageAction">
                  <Button
                    type="settings"
                    onClick={() => modifyMessage('remove', index)}
                    icon={<MdCancel />}
                    label={variables.getMessage('marketplace:product.buttons.remove')}
                  />

                </div>
              </div>
            </div>
          ))}
        </div>
        {messages.length === 0 && (
          <div className="photosEmpty">
            <div className="emptyNewMessage">
              <MdOutlineTextsms />
              <span className="title">
                {variables.getMessage('settings:sections.message.no_messages')}
              </span>
              <span className="subtitle">
                {variables.getMessage('settings:sections.message.add_some')}
              </span>
              <Button
                type="settings"
                onClick={() => modifyMessage('add')}
                icon={<MdAdd />}
                label={variables.getMessage('settings:sections.message.add')}
              />
            </div>
          </div>
        )}
      </PreferencesWrapper>
    </>
  );
}

export { MessageOptions as default, MessageOptions };
