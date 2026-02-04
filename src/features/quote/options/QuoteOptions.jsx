import { useT } from 'contexts';
import variables from 'config/variables';
import React, { useState, useEffect } from 'react';
import {
  MdCancel,
  MdAdd,
  MdSource,
  MdOutlineFormatQuote,
  MdExplore,
  MdPalette,
  MdRefresh,
} from 'react-icons/md';
import googleFonts from 'config/googleFonts.json';
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
  const t = useT();
  const getCustom = () => {
    let data = JSON.parse(localStorage.getItem('customQuote'));
    if (data === null) {
      data = [];
    }
    return data;
  };

  const [quoteType, setQuoteType] = useState(() => {
    let type = localStorage.getItem('quoteType') || 'quote_pack';
    if (type === 'api') {
      type = 'quote_pack';
      localStorage.setItem('quoteType', 'quote_pack');
    }
    return type;
  });

  useState(() => {
    if (localStorage.getItem('authorDetails') === null) {
      localStorage.setItem('authorDetails', 'true');
    }
  });

  const [customQuote, setCustomQuote] = useState(getCustom());

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
    localStorage.removeItem('quoteQueue');
    localStorage.removeItem('currentQuote');
  };

  const QUOTE_SECTION = 'modals.main.settings.sections.quote';

  const ButtonOptions = () => {
    return (
      <Row>
        <Content
          title={t(`${QUOTE_SECTION}.buttons.title`)}
          subtitle={t('modals.main.settings.sections.quote.buttons.subtitle')}
        />
        <Action>
          <Checkbox name="copyButton" text={t(`${QUOTE_SECTION}.buttons.copy`)} category="quote" />
          <Checkbox name="quoteShareButton" text={t('widgets.quote.share')} category="quote" />
          <Checkbox
            name="favouriteQuoteEnabled"
            text={t(`${QUOTE_SECTION}.buttons.favourite`)}
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
        label={t('modals.main.settings.sections.background.type.title')}
        onChange={(value) => setQuoteType(value)}
        category="quote"
        items={[
          localStorage.getItem('quote_packs') && {
            value: 'quote_pack',
            text: t('modals.main.marketplace.title'),
          },
          { value: 'custom', text: t(`${QUOTE_SECTION}.custom`) },
        ]}
      />
    );
  };

  const FrequencyOptions = () => {
    return (
      <Row>
        <Content
          title={t(`${QUOTE_SECTION}.frequency.title`)}
          subtitle={t(`${QUOTE_SECTION}.frequency.subtitle`)}
        />
        <Action>
          <Dropdown
            name="quoteFrequency"
            label={t(`${QUOTE_SECTION}.frequency.title`)}
            onChange={(value) => {
              localStorage.setItem('quoteStartTime', Date.now());
              const oldValue = localStorage.getItem('quoteFrequency');
              if (oldValue === 'refresh' && value !== 'refresh') {
                localStorage.removeItem('quoteQueue');
              }
              window.dispatchEvent(
                new CustomEvent('frequencyChanged', {
                  detail: { type: 'quote' },
                }),
              );
            }}
            items={FREQUENCY_OPTIONS.map((opt) => ({
              value: opt.value,
              text: t(opt.text),
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
          title={t('modals.main.settings.additional_settings')}
          subtitle={t(`${QUOTE_SECTION}.additional`)}
        />
        <Action>
          <Checkbox
            name="authorDetails"
            text={t(`${QUOTE_SECTION}.author_details`)}
            element=".other"
          />
          <Checkbox
            name="authorLink"
            text={t(`${QUOTE_SECTION}.author_link`)}
            element=".other"
            disabled={localStorage.getItem('authorDetails') === 'false'}
          />
          <Checkbox
            name="authorImg"
            text={t(`${QUOTE_SECTION}.author_img`)}
            element=".other"
            disabled={localStorage.getItem('authorDetails') === 'false'}
          />
        </Action>
      </Row>
    );
  };

  const AppearanceSection = () => {
    const [quoteColor, setQuoteColor] = useState(localStorage.getItem('quoteColor') || '#ffffff');
    const fontWeight = `${QUOTE_SECTION}.appearance.font_weight`;

    const updateColor = (event) => {
      const color = event.target.value;
      setQuoteColor(color);
      localStorage.setItem('quoteColor', color);
    };

    return (
      <>
        <Row>
          <Content
            title={t(`${QUOTE_SECTION}.appearance.font.title`)}
            subtitle={t(`${QUOTE_SECTION}.appearance.font.description`)}
          />
          <Action>
            <Dropdown
              label={t(`${QUOTE_SECTION}.appearance.font.custom`)}
              name="quoteFont"
              category="quote"
              searchable={true}
              items={googleFonts.map((font) => ({
                value: font,
                text: font,
              }))}
            />
          </Action>
        </Row>
        <Row>
          <Content
            title={t(`${QUOTE_SECTION}.appearance.font_weight.title`)}
            subtitle={t(`${QUOTE_SECTION}.appearance.font_weight.description`)}
          />
          <Action>
            <Dropdown
              label={t(`${QUOTE_SECTION}.appearance.font_weight.title`)}
              name="quoteFontWeight"
              category="quote"
              items={[
                { value: '600', text: t(fontWeight + '.semi_bold') },
                { value: '100', text: t(fontWeight + '.thin') },
                { value: '200', text: t(fontWeight + '.extra_light') },
                { value: '300', text: t(fontWeight + '.light') },
                { value: '400', text: t(fontWeight + '.normal') },
                { value: '500', text: t(fontWeight + '.medium') },
                { value: '700', text: t(fontWeight + '.bold') },
                { value: '800', text: t(fontWeight + '.extra_bold') },
              ]}
            />
          </Action>
        </Row>
        <Row>
          <Content
            title={t(`${QUOTE_SECTION}.appearance.font_style.title`)}
            subtitle={t(`${QUOTE_SECTION}.appearance.font_style.description`)}
          />
          <Action>
            <Dropdown
              label={t(`${QUOTE_SECTION}.appearance.font_style.title`)}
              name="quoteFontStyle"
              category="quote"
              items={[
                { value: 'normal', text: t(`${QUOTE_SECTION}.appearance.font_style.normal`) },
                { value: 'italic', text: t(`${QUOTE_SECTION}.appearance.font_style.italic`) },
                { value: 'oblique', text: t(`${QUOTE_SECTION}.appearance.font_style.oblique`) },
              ]}
            />
          </Action>
        </Row>
        <Row final={true}>
          <Content
            title={t(`${QUOTE_SECTION}.appearance.color.title`)}
            subtitle={t(`${QUOTE_SECTION}.appearance.color.description`)}
          />
          <Action>
            <div className="colourInput">
              <input type="color" name="quoteColor" onChange={updateColor} value={quoteColor} />
              <label htmlFor="quoteColor" className="customBackgroundHex">
                {quoteColor}
              </label>
            </div>
            <span
              className="link"
              onClick={() => {
                localStorage.setItem('quoteColor', '#ffffff');
                setQuoteColor('#ffffff');
              }}
            >
              <MdRefresh />
              {t('modals.main.settings.buttons.reset')}
            </span>
          </Action>
        </Row>
      </>
    );
  };

  const isSourceSection = currentSubSection === 'source';
  const isAppearanceSection = currentSubSection === 'appearance';

  const getInstalledQuotePacks = () => {
    try {
      const installed = JSON.parse(localStorage.getItem('installed')) || [];
      return installed.filter((item) => item.type === 'quotes');
    } catch (e) {
      return [];
    }
  };

  const [installedQuotePacks, setInstalledQuotePacks] = useState(getInstalledQuotePacks());

  useEffect(() => {
    const handleInstalledAddonsChanged = () => {
      setInstalledQuotePacks(getInstalledQuotePacks());
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
    const DEFAULT_PACK_ID = '0c8a5bdebd13';
    if (installedQuotePacks.length === 1) {
      const remainingPack = installedQuotePacks[0];
      if (remainingPack.id === DEFAULT_PACK_ID || remainingPack.name === name) {
        toast(t('toasts.quote_pack_only_one'));
        return;
      }
    }

    uninstall(type, name);
    toast(t('toasts.uninstalled'));
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
    const itemId = pack.name;
    updateHash(`#discover/all?item=${itemId}`);

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
            title={t(`${QUOTE_SECTION}.custom`)}
            subtitle={t(`${QUOTE_SECTION}.custom_subtitle`)}
          />
          <Action>
            <Button
              type="settings"
              onClick={() => modifyCustomQuote('add')}
              icon={<MdAdd />}
              label={t(`${QUOTE_SECTION}.add`)}
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
                      {t('modals.main.settings.sections.quote.title')}
                    </span>
                    <button
                      className="quoteRemoveBtn"
                      onClick={() => modifyCustomQuote('remove', index)}
                      aria-label={t('modals.main.marketplace.product.buttons.remove')}
                    >
                      <MdCancel />
                    </button>
                  </div>
                  <div className="quoteInputGroup">
                    <Textarea
                      value={quote.quote}
                      placeholder={t('modals.main.settings.sections.quote.title')}
                      onChange={(e) => handleCustomQuote(e, true, index, 'quote')}
                      minRows={3}
                      className="quoteTextarea"
                    />
                  </div>
                  <div className="quoteInputGroup">
                    <label className="quoteLabel">
                      {t('modals.main.settings.sections.quote.author')}
                    </label>
                    <input
                      type="text"
                      className="authorInput"
                      value={quote.author}
                      placeholder={t('modals.main.settings.sections.quote.author')}
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
            <span className="emptyTitle">{t(`${QUOTE_SECTION}.no_quotes`)}</span>
            <span className="emptySubtitle">
              {t('modals.main.settings.sections.message.add_some')}
            </span>
            <Button
              type="settings"
              onClick={() => modifyCustomQuote('add')}
              icon={<MdAdd />}
              label={t(`${QUOTE_SECTION}.add`)}
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
            title={t('modals.main.settings.sections.quote.installed_packs_title')}
            subtitle={`${installedQuotePacks.length} ${installedQuotePacks.length === 1 ? 'pack' : 'packs'} • ${totalQuotes} ${totalQuotes === 1 ? 'quote' : 'quotes'}`}
          />
          <Action>
            <Button
              type="settings"
              onClick={goToQuotePacks}
              icon={<MdExplore />}
              label={t('modals.main.settings.sections.quote.get_more')}
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
          onTogglePack={() => {}}
          viewType="grid"
          showChips={false}
        />
      </>
    );
  } else {
    // api
    customSettings = <></>;
  }

  let header;
  if (isSourceSection) {
    header = (
      <Header
        title={t(`${QUOTE_SECTION}.title`)}
        secondaryTitle={t('modals.main.settings.sections.background.source.title')}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      />
    );
  } else if (isAppearanceSection) {
    header = (
      <Header
        title={t(`${QUOTE_SECTION}.title`)}
        secondaryTitle={t(`${QUOTE_SECTION}.appearance.title`)}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      />
    );
  } else {
    header = (
      <Header
        title={t(`${QUOTE_SECTION}.title`)}
        setting="quote"
        category="quote"
        element=".quotediv"
        zoomSetting="zoomQuote"
        visibilityToggle={true}
      />
    );
  }

  return (
    <>
      {header}
      {isSourceSection && (
        <>
          <Row final={true}>
            <Content
              title={t('modals.main.settings.sections.background.source.title')}
              subtitle={t(`${QUOTE_SECTION}.source_subtitle`)}
            />
            <Action>
              <SourceDropdown />
            </Action>
          </Row>
          {customSettings}
        </>
      )}
      {isAppearanceSection && <AppearanceSection />}
      {!isSourceSection && !isAppearanceSection && (
        <PreferencesWrapper
          setting="quote"
          zoomSetting="zoomQuote"
          category="quote"
          visibilityToggle={true}
        >
          <Section
            icon={<MdPalette />}
            title={t(`${QUOTE_SECTION}.appearance.title`)}
            subtitle={t(`${QUOTE_SECTION}.appearance.description`)}
            onClick={() => onSubSectionChange('appearance', sectionName)}
          />
          <Section
            icon={<MdSource />}
            title={t('modals.main.settings.sections.background.source.title')}
            subtitle={t(`${QUOTE_SECTION}.source_subtitle`)}
            onClick={() => onSubSectionChange('source', sectionName)}
          >
            <SourceDropdown />
          </Section>
          <ButtonOptions />
          <FrequencyOptions />
          <AdditionalOptions />
        </PreferencesWrapper>
      )}
    </>
  );
};

export { QuoteOptions as default, QuoteOptions };
