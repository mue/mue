import variables from 'config/variables';

import { useState, useEffect } from 'react';

import { MdSource } from 'react-icons/md';

import {
  Header,
  Row,
  Content,
  Action,
  Section,
  PreferencesWrapper,
} from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';

import { useTab } from 'components/Elements/MainModal/backend/TabContext';

import CustomSettings from './Custom';

import defaults from './default';

const QuoteOptions = () => {
  const [quoteType, setQuoteType] = useState(
    localStorage.getItem('quoteType') || defaults.quoteType,
  );
  const { subSection } = useTab();

  useEffect(() => {
    localStorage.setItem('quoteType', quoteType);
  }, [quoteType]);

  const QUOTE_SECTION = 'settings:sections.quote';

  const ButtonOptions = () => {
    return (
      <Row>
        <Content
          title={variables.getMessage(`${QUOTE_SECTION}.buttons.title`)}
          subtitle={variables.getMessage('settings:sections.quote.buttons.subtitle')}
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
        label={variables.getMessage('settings:sections.background.type.title')}
        onChange={(value) => setQuoteType(value)}
        category="quote"
        items={[
          localStorage.getItem('quote_packs') && {
            value: 'quote_pack',
            text: variables.getMessage('modals.main.navbar.marketplace'),
          },
          {
            value: 'api',
            text: variables.getMessage('settings:sections.background.type.api'),
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
          title={variables.getMessage('settings:additional_settings')}
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

  return (
    <>
      {subSection === 'source' ? (
        <Header
          title={variables.getMessage(`${QUOTE_SECTION}.title`)}
          secondaryTitle={variables.getMessage('settings:sections.background.source.title')}
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
            title={variables.getMessage('settings:sections.background.source.title')}
            subtitle={variables.getMessage(`${QUOTE_SECTION}.source_subtitle`)}
          />
          <Action>
            <SourceDropdown />
          </Action>
        </Row>
      )}

      {subSection !== 'source' && (
        <>
          <Section
            id="source"
            icon={<MdSource />}
            title={variables.getMessage('settings:sections.background.source.title')}
            subtitle={variables.getMessage(`${QUOTE_SECTION}.source_subtitle`)}
          >
            <SourceDropdown />
          </Section>
          <PreferencesWrapper
            setting="quote"
            default={defaults.quote}
            zoomSetting="zoomQuote"
            category="quote"
            visibilityToggle={true}
          >
            <ButtonOptions />
            <AdditionalOptions />
          </PreferencesWrapper>
        </>
      )}

      {quoteType === 'custom' && subSection === 'source' && <CustomSettings />}
    </>
  );
};

export { QuoteOptions as default, QuoteOptions };
