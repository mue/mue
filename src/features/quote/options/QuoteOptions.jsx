import variables from 'config/variables';
import React, { useState } from 'react';
import { MdCancel, MdAdd, MdSource, MdOutlineFormatQuote } from 'react-icons/md';

import {
  Header,
  Row,
  Content,
  Action,
  Section,
  PreferencesWrapper,
} from 'components/Layout/Settings';
import { Checkbox, Dropdown, Textarea } from 'components/Form/Settings';
import { Button } from 'components/Elements';

const QuoteOptions = ({ currentSubSection, onSubSectionChange, sectionName }) => {
  const getCustom = () => {
    let data = JSON.parse(localStorage.getItem('customQuote'));
    if (data === null) {
      data = [];
    }
    return data;
  };

  const [quoteType, setQuoteType] = useState(() => {
    let type = localStorage.getItem('quoteType') || 'quote_pack';
    // Migrate deprecated 'api' type to 'quote_pack'
    if (type === 'api') {
      type = 'quote_pack';
      localStorage.setItem('quoteType', 'quote_pack');
    }
    return type;
  });
  const [customQuote, setCustomQuote] = useState(getCustom());

  const handleCustomQuote = (e, text, index, type) => {
    const result = text === true ? e.target.value : e.target.result;

    const updatedCustomQuote = [...customQuote];
    updatedCustomQuote[index][type] = result;
    setCustomQuote(updatedCustomQuote);

    localStorage.setItem('customQuote', JSON.stringify(updatedCustomQuote));
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  };

  const modifyCustomQuote = (type, index) => {
    const updatedCustomQuote = [...customQuote];
    if (type === 'add') {
      updatedCustomQuote.push({ quote: '', author: '' });
    } else {
      updatedCustomQuote.splice(index, 1);
    }

    setCustomQuote(updatedCustomQuote);

    localStorage.setItem('customQuote', JSON.stringify(updatedCustomQuote));
  };

  const QUOTE_SECTION = 'modals.main.settings.sections.quote';

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
            text: variables.getMessage('modals.main.marketplace.title'),
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
            name="authorDetails"
            text={variables.getMessage(`${QUOTE_SECTION}.author_details`)}
            element=".other"
          />
          <Checkbox
            name="authorLink"
            text={variables.getMessage(`${QUOTE_SECTION}.author_link`)}
            element=".other"
            disabled={localStorage.getItem('authorDetails') === 'false'}
          />
          <Checkbox
            name="authorImg"
            text={variables.getMessage(`${QUOTE_SECTION}.author_img`)}
            element=".other"
            disabled={localStorage.getItem('authorDetails') === 'false'}
          />
        </Action>
      </Row>
    );
  };

  const isSourceSection = currentSubSection === 'source';

  let customSettings;
  if (quoteType === 'custom' && isSourceSection) {
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
                  <Textarea
                    value={customQuote[index].quote}
                    placeholder={variables.getMessage('modals.main.settings.sections.quote.title')}
                    onChange={(e) => handleCustomQuote(e, true, index, 'quote')}
                    style={{ fontSize: '22px', fontWeight: 'bold' }}
                    minRows={1}
                  />
                  <Textarea
                    value={customQuote[index].author}
                    placeholder={variables.getMessage('modals.main.settings.sections.quote.author')}
                    className="subtitle"
                    onChange={(e) => handleCustomQuote(e, true, index, 'author')}
                    minRows={1}
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
      {isSourceSection ? (
        <Header
          title={variables.getMessage(`${QUOTE_SECTION}.title`)}
          secondaryTitle={variables.getMessage(
            'modals.main.settings.sections.background.source.title',
          )}
          goBack={() => onSubSectionChange(null, sectionName)}
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
      {isSourceSection && (
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
      {!isSourceSection && (
        <PreferencesWrapper
          setting="quote"
          zoomSetting="zoomQuote"
          category="quote"
          visibilityToggle={true}
        >
          <Section
            icon={<MdSource />}
            title={variables.getMessage('modals.main.settings.sections.background.source.title')}
            subtitle={variables.getMessage(`${QUOTE_SECTION}.source_subtitle`)}
            onClick={() => onSubSectionChange('source', sectionName)}
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
