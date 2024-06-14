import variables from 'config/variables';
import React, { useState, useEffect } from 'react';
import { MdCancel, MdAdd, MdSource, MdOutlineFormatQuote } from 'react-icons/md';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import {
  Header,
  Row,
  Content,
  Action,
  Section,
  PreferencesWrapper,
} from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';

import { toast } from 'react-toastify';
import EventBus from 'utils/eventbus';
import defaults from './default';

const QuoteOptions = () => {
  const [quoteType, setQuoteType] = useState(localStorage.getItem('quoteType') || defaults.quoteType);
  const [customQuote, setCustomQuote] = useState(getCustom());
  const [sourceSection, setSourceSection] = useState(false);
  const QUOTE_SECTION = 'modals.main.settings.sections.quote';
  const { subSection } = useTab();

  useEffect(() => {
    localStorage.setItem('quoteType', quoteType);
  }, [quoteType]);

  function resetCustom() {
    localStorage.setItem('customQuote', '[{"quote": "", "author": ""}]');
    setCustomQuote([{ quote: '', author: '' }]);
    toast(variables.getMessage('toasts.reset'));
    EventBus.emit('refresh', 'background');
  }

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

  const ButtonOptions = () => {
    return (
      <Row>
        <Content
          title={variables.getMessage(`${QUOTE_SECTION}.buttons.title`)}
          subtitle={variables.getMessage('modals.main.settings.sections.quote.buttons.subtitle')}
        />
        <Action>
          <Checkbox
            name="copyButton"
            text={variables.getMessage(`${QUOTE_SECTION}.buttons.copy`)}
            category="quote"
          />
          <Checkbox
            name="quoteShareButton"
            text={variables.getMessage('widgets.quote.share')}
            category="quote"
          />
          <Checkbox
            name="favouriteQuoteEnabled"
            text={variables.getMessage(`${QUOTE_SECTION}.buttons.favourite`)}
            category="quote"
          />
        </Action>
      </Row>
    );
  };

  const SourceDropdown = () => {
    return (
      <Dropdown
        name="quoteType"
        label={variables.getMessage('modals.main.settings.sections.background.type.title')}
        onChange={(value) => setQuoteType(value)}
        category="quote"
        items={[
          localStorage.getItem('quote_packs') && {
            value: 'quote_pack',
            text: variables.getMessage('modals.main.navbar.marketplace'),
          },
          {
            value: 'api',
            text: variables.getMessage('modals.main.settings.sections.background.type.api'),
          },
          { value: 'custom', text: variables.getMessage(`${QUOTE_SECTION}.custom`) },
        ]}
      />
    );
  };

  const AdditionalOptions = () => {
    return (
      <Row final={true}>
        <Content
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage(`${QUOTE_SECTION}.additional`)}
        />
        <Action>
          <Checkbox
            name="authorLink"
            text={variables.getMessage(`${QUOTE_SECTION}.author_link`)}
            element=".other"
          />
          <Checkbox
            name="authorImg"
            text={variables.getMessage(`${QUOTE_SECTION}.author_img`)}
            element=".other"
          />
        </Action>
      </Row>
    );
  };

  let customSettings;
  if (quoteType === 'custom' && subSection === 'source') {
    customSettings = (
      <>
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
                    placeholder={variables.getMessage('modals.main.settings.sections.quote.title')}
                    onChange={(e) => handleCustomQuote(e, index, 'quote')}
                    varient="outlined"
                    style={{ fontSize: '22px', fontWeight: 'bold' }}
                  />
                  <TextareaAutosize
                    value={customQuote[index].author}
                    placeholder={variables.getMessage('modals.main.settings.sections.quote.author')}
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
                      label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
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
                {variables.getMessage('modals.main.settings.sections.message.add_some')}
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
  } else {
    // api
    customSettings = <></>;
  }

  return (
    <>
      {subSection === 'source' ? (
        <Header
          title={variables.getMessage(`${QUOTE_SECTION}.title`)}
          secondaryTitle={variables.getMessage('modals.main.settings.sections.background.source.title')}
          goBack={() => setSourceSection(false)}
          report={false}
        />
      ) : (
        <Header
          title={variables.getMessage(`${QUOTE_SECTION}.title`)}
          setting="quote"
          category="quote"
          element=".quotediv"
          zoomSetting="zoomQuote"
          visibilityToggle={true}
        />
      )}
      {subSection === 'source' && (
        <Row final={true}>
          <Content
            title={variables.getMessage('modals.main.settings.sections.background.source.title')}
            subtitle={variables.getMessage(`${QUOTE_SECTION}.source_subtitle`)}
          />
          <Action>
            <SourceDropdown />
          </Action>
        </Row>
      )}
      {subSection !== 'source' && (
        <PreferencesWrapper
          setting="quote"
          zoomSetting="zoomQuote"
          category="quote"
          visibilityToggle={true}
        >
          <Section
            id="source"
            icon={<MdSource />}
            title={variables.getMessage('modals.main.settings.sections.background.source.title')}
            subtitle={variables.getMessage(`${QUOTE_SECTION}.source_subtitle`)}
            onClick={() => setSourceSection(true)}
          >
            <SourceDropdown />
          </Section>
          <ButtonOptions />
          <AdditionalOptions />
        </PreferencesWrapper>
      )}
      {customSettings}
    </>
  );
};

export { QuoteOptions as default, QuoteOptions };
