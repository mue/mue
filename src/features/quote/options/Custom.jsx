import variables from 'config/variables';
import { useState } from 'react';
import { MdCancel, MdAdd, MdOutlineFormatQuote } from 'react-icons/md';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import { Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Button } from 'components/Elements';

function CustomSettings() {
  const [customQuote, setCustomQuote] = useState(getCustom());

  function handleCustomQuote(e, index, type) {
    const result = e.target.value;
    const newCustomQuote = [...customQuote];
    newCustomQuote[index][type] = result;
    setCustomQuote(newCustomQuote);
    localStorage.setItem('customQuote', JSON.stringify(newCustomQuote));
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  }

  function modifyCustomQuote(type, index) {
    let newCustomQuote = [...customQuote];
    if (type === 'add') {
      newCustomQuote.push({ quote: '', author: '' });
    } else {
      newCustomQuote.splice(index, 1);
    }
    setCustomQuote(newCustomQuote);
    localStorage.setItem('customQuote', JSON.stringify(newCustomQuote));
  }

  function getCustom() {
    let data = JSON.parse(localStorage.getItem('customQuote'));
    if (data === null) {
      data = [];
    }
    return data;
  }

  const QUOTE_SECTION = 'settings:sections.quote';

  return (
    <>
      <PreferencesWrapper>
        <Row final={true}>
          <Content
            title={variables.getMessage(`${QUOTE_SECTION}.custom`)}
            subtitle={variables.getMessage(`${QUOTE_SECTION}.custom_subtitle`)}
          />
          <Action>
            <Button
              type="settings"
              onClick={() => modifyCustomQuote('add')}
              icon={<MdAdd />}
              label={variables.getMessage(`${QUOTE_SECTION}.add`)}
            />
          </Action>
        </Row>
      </PreferencesWrapper>
      {customQuote.length !== 0 ? (
        <div className="messagesContainer">
          {customQuote.map((_url, index) => (
            <div className="messageMap" key={index}>
              <div className="icon">
                <MdOutlineFormatQuote />
              </div>
              <div className="messageText">
                <TextareaAutosize
                  value={customQuote[index].quote}
                  placeholder={variables.getMessage('settings:sections.quote.title')}
                  onChange={(e) => handleCustomQuote(e, index, 'quote')}
                  varient="outlined"
                  style={{ fontSize: '22px', fontWeight: 'bold' }}
                />
                <TextareaAutosize
                  value={customQuote[index].author}
                  placeholder={variables.getMessage('settings:sections.quote.author')}
                  className="subtitle"
                  onChange={(e) => handleCustomQuote(e, index, 'author')}
                  varient="outlined"
                />
              </div>
              <div>
                <div className="messageAction">
                  <Button
                    type="settings"
                    onClick={() => modifyCustomQuote('remove', index)}
                    icon={<MdCancel />}
                    label={variables.getMessage('marketplace:product.buttons.remove')}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="photosEmpty">
          <div className="emptyNewMessage">
            <MdOutlineFormatQuote />
            <span className="title">{variables.getMessage(`${QUOTE_SECTION}.no_quotes`)}</span>
            <span className="subtitle">
              {variables.getMessage('settings:sections.message.add_some')}
            </span>
            <Button
              type="settings"
              onClick={() => modifyCustomQuote('add')}
              icon={<MdAdd />}
              label={variables.getMessage(`${QUOTE_SECTION}.add`)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default CustomSettings;
