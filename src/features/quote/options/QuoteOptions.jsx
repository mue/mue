import variables from 'config/variables';
import React, { useState, useEffect } from 'react';
import { MdCancel, MdAdd, MdSource, MdOutlineFormatQuote, MdExplore } from 'react-icons/md';
import { toast } from 'react-toastify';

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
import { FREQUENCY_OPTIONS } from 'utils/frequencyManager';
import Items from 'features/marketplace/components/Items/Items';
import { uninstall } from 'utils/marketplace';
import { updateHash } from 'utils/deepLinking';
import './QuoteOptions.scss';

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

  // Migration: Force authorDetails on for users upgrading from older versions
  useState(() => {
    if (localStorage.getItem('authorDetails') === null) {
      localStorage.setItem('authorDetails', 'true');
    }
  });

  const [customQuote, setCustomQuote] = useState(getCustom());

  // Clear quote queue when quote type changes
  useEffect(() => {
    localStorage.removeItem('quoteQueue');
    localStorage.removeItem('currentQuote');
  }, [quoteType]);

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
    // Clear quote queue when custom quotes are modified
    localStorage.removeItem('quoteQueue');
    localStorage.removeItem('currentQuote');
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

  const FrequencyOptions = () => {
    return (
      <Row>
        <Content
          title={variables.getMessage(`${QUOTE_SECTION}.frequency.title`)}
          subtitle={variables.getMessage(`${QUOTE_SECTION}.frequency.subtitle`)}
        />
        <Action>
          <Dropdown
            name="quoteFrequency"
            label={variables.getMessage(`${QUOTE_SECTION}.frequency.title`)}
            onChange={(value) => {
              localStorage.setItem('quoteStartTime', Date.now());
              // Clear queue if switching from refresh to time-based frequency
              const oldValue = localStorage.getItem('quoteFrequency');
              if (oldValue === 'refresh' && value !== 'refresh') {
                localStorage.removeItem('quoteQueue');
              }
              // Notify the frequency interval hook that the frequency changed
              window.dispatchEvent(
                new CustomEvent('frequencyChanged', {
                  detail: { type: 'quote' },
                }),
              );
            }}
            items={FREQUENCY_OPTIONS.map((opt) => ({
              value: opt.value,
              text: variables.getMessage(opt.text),
            }))}
          />
        </Action>
      </Row>
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

  // Get installed quote packs
  const getInstalledQuotePacks = () => {
    try {
      const installed = JSON.parse(localStorage.getItem('installed')) || [];
      return installed.filter((item) => item.type === 'quotes');
    } catch (e) {
      return [];
    }
  };

  const [installedQuotePacks, setInstalledQuotePacks] = useState(getInstalledQuotePacks());

  // Listen for changes to installed addons
  useEffect(() => {
    const handleInstalledAddonsChanged = () => {
      setInstalledQuotePacks(getInstalledQuotePacks());
      // Update quoteType if it changed (e.g., when all packs are uninstalled)
      const currentType = localStorage.getItem('quoteType') || 'api';
      if (currentType !== quoteType) {
        setQuoteType(currentType);
      }
    };

    window.addEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
    return () => {
      window.removeEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
    };
  }, [quoteType]);

  const handleUninstall = (type, name) => {
    // Prevent removing the default pack if it's the only one remaining
    const DEFAULT_PACK_ID = '0c8a5bdebd13';
    if (installedQuotePacks.length === 1) {
      const remainingPack = installedQuotePacks[0];
      if (remainingPack.id === DEFAULT_PACK_ID || remainingPack.name === name) {
        toast(variables.getMessage('toasts.quote_pack_only_one'));
        return;
      }
    }

    uninstall(type, name);
    toast(variables.getMessage('toasts.uninstalled'));
    variables.stats.postEvent('marketplace-item', `${name} uninstalled`);
    variables.stats.postEvent('marketplace', 'Uninstall');
    setInstalledQuotePacks(getInstalledQuotePacks());
    window.dispatchEvent(new window.Event('installedAddonsChanged'));
  };

  const goToQuotePacks = () => {
    updateHash('#discover/quote_packs');
    const event = new window.Event('popstate');
    window.dispatchEvent(event);
  };

  const handleToggle = (pack) => {
    // Navigate to discover tab with the item
    const itemId = pack.name;
    updateHash(`#discover/all?item=${itemId}`);

    // Trigger navigation
    const event = new window.Event('popstate');
    window.dispatchEvent(event);

    variables.stats.postEvent('marketplace', 'ItemPage viewed');
  };

  const getTotalQuoteCount = () => {
    return installedQuotePacks.reduce((total, pack) => {
      return total + (pack.quotes?.length || 0);
    }, 0);
  };

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
          <div className="customQuoteContainer">
            {customQuote.map((quote, index) => (
              <div className="customQuoteItem" key={index}>
                <div className="quoteContent">
                  <div className="quoteHeader">
                    <span className="quoteLabel">
                      <MdOutlineFormatQuote className="quoteLabelIcon" />
                      {variables.getMessage('modals.main.settings.sections.quote.title')}
                    </span>
                    <button
                      className="quoteRemoveBtn"
                      onClick={() => modifyCustomQuote('remove', index)}
                      aria-label={variables.getMessage(
                        'modals.main.marketplace.product.buttons.remove',
                      )}
                    >
                      <MdCancel />
                    </button>
                  </div>
                  <div className="quoteInputGroup">
                    <Textarea
                      value={quote.quote}
                      placeholder={variables.getMessage(
                        'modals.main.settings.sections.quote.title',
                      )}
                      onChange={(e) => handleCustomQuote(e, true, index, 'quote')}
                      minRows={3}
                      className="quoteTextarea"
                    />
                  </div>
                  <div className="quoteInputGroup">
                    <label className="quoteLabel">
                      {variables.getMessage('modals.main.settings.sections.quote.author')}
                    </label>
                    <input
                      type="text"
                      className="authorInput"
                      value={quote.author}
                      placeholder={variables.getMessage(
                        'modals.main.settings.sections.quote.author',
                      )}
                      onChange={(e) => handleCustomQuote(e, true, index, 'author')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="customQuoteEmpty">
            <MdOutlineFormatQuote className="emptyIcon" />
            <span className="emptyTitle">{variables.getMessage(`${QUOTE_SECTION}.no_quotes`)}</span>
            <span className="emptySubtitle">
              {variables.getMessage('modals.main.settings.sections.message.add_some')}
            </span>
            <Button
              type="settings"
              onClick={() => modifyCustomQuote('add')}
              icon={<MdAdd />}
              label={variables.getMessage(`${QUOTE_SECTION}.add`)}
            />
          </div>
        )}
      </>
    );
  } else if (quoteType === 'quote_pack' && isSourceSection && installedQuotePacks.length > 0) {
    const totalQuotes = getTotalQuoteCount();
    customSettings = (
      <>
        <Row final={true}>
          <Content
            title={variables.getMessage('modals.main.settings.sections.quote.installed_packs_title')}
            subtitle={`${installedQuotePacks.length} ${installedQuotePacks.length === 1 ? 'pack' : 'packs'} • ${totalQuotes} ${totalQuotes === 1 ? 'quote' : 'quotes'}`}
          />
          <Action>
            <Button
              type="settings"
              onClick={goToQuotePacks}
              icon={<MdExplore />}
              label={variables.getMessage('modals.main.settings.sections.quote.get_more')}
            />
          </Action>
        </Row>
        <Items
          items={installedQuotePacks}
          isAdded={true}
          filter=""
          toggleFunction={handleToggle}
          showCreateYourOwn={false}
          onUninstall={handleUninstall}
          viewType="grid"
        />
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
          <FrequencyOptions />
          <AdditionalOptions />
        </PreferencesWrapper>
      )}
      {customSettings}
    </>
  );
};

export { QuoteOptions as default, QuoteOptions };
