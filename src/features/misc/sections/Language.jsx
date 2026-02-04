import { useState, useMemo } from 'react';
import { useT, useTranslation } from 'contexts/TranslationContext';

import { MdOutlineOpenInNew, MdComputer } from 'react-icons/md';

import { Radio, Checkbox, SearchInput } from 'components/Form/Settings';

import languages from '@/i18n/languages.json';
import translationPercentages from '@/i18n/translationPercentages.json';

const LanguageOptions = () => {
  const t = useT();
  const { language: currentLanguage, changeLanguage } = useTranslation();
  const languageTitle = t('modals.main.settings.sections.language.title');

  const [searchQuery, setSearchQuery] = useState('');

  const languageOptions = useMemo(() => {
    const currentLanguageISO = currentLanguage.replace('_', '-');

    const displayNames = new Intl.DisplayNames([currentLanguageISO], { type: 'language' });

    const mappedLanguages = languages.map((lang) => {
      const nativeName = lang.name;

      const isoCode = lang.value.replace('_', '-');
      const percentage = translationPercentages[lang.value]?.percent || 0;

      let translatedName;
      try {
        translatedName = displayNames.of(isoCode);
        if (translatedName) {
          translatedName = translatedName.split(' (')[0];
        }
      } catch {
        translatedName = nativeName;
      }

      const displayName =
        !translatedName || translatedName === nativeName ? (
          <>
            {nativeName} <span style={{ color: '#999', fontSize: '0.85em' }}>({percentage}%)</span>
          </>
        ) : (
          <>
            {nativeName}{' '}
            <span style={{ color: '#999', fontSize: '0.85em' }}>
              ({translatedName} • {percentage}%)
            </span>
          </>
        );

      return {
        name: displayName,
        value: lang.value,
        nativeName,
        percentage,
        searchText: `${nativeName} ${translatedName || ''}`.toLowerCase(),
      };
    });

    return mappedLanguages.sort((a, b) => a.nativeName.localeCompare(b.nativeName));
  }, [currentLanguage]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return languageOptions;
    }
    const query = searchQuery.toLowerCase();
    return languageOptions.filter((lang) => lang.searchText.includes(query));
  }, [languageOptions, searchQuery]);

  const systemLanguage = useMemo(() => {
    const browserLang = navigator.language.replace('-', '_');
    return (
      languages.find((l) => l.value === browserLang) ||
      languages.find((l) => l.value.startsWith(browserLang.split('_')[0]))
    );
  }, []);

  const currentLangOption = languageOptions.find((l) => l.value === currentLanguage);

  return (
    <>
      <div className="modalHeader">
        <span className="mainTitle">{languageTitle}</span>
        <div className="headerActions">
          <a
            className="link"
            href="https://hosted.weblate.org/new-lang/mue/mue-tab/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('common.add_translation')}
            <MdOutlineOpenInNew />
          </a>
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Checkbox
          name="localeFormatting"
          text={t('modals.main.settings.sections.language.locale_formatting')}
          category="other"
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <SearchInput
          placeholder={t('modals.main.settings.sections.language.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {currentLangOption && (
          <div style={{ color: '#888', whiteSpace: 'nowrap' }}>
            {t('modals.main.settings.sections.language.current')}:{' '}
            <strong style={{ color: 'var(--fg)' }}>{currentLangOption.nativeName}</strong>
          </div>
        )}
      </div>
      {systemLanguage && systemLanguage.value !== currentLanguage && (
        <button
          onClick={() => changeLanguage(systemLanguage.value)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            marginBottom: 16,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'var(--fg)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <MdComputer style={{ fontSize: '18px', opacity: 0.8 }} />
          {t('modals.main.settings.sections.language.use_system')}
          <span style={{ opacity: 0.6 }}>• {systemLanguage.name}</span>
        </button>
      )}
      <div className="languageSettings">
        <Radio name="language" options={filteredLanguages} element=".other" />
      </div>
    </>
  );
};

export { LanguageOptions as default, LanguageOptions };
