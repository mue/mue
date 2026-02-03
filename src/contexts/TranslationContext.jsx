import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { initTranslations, translations } from 'lib/translations';
import variables from 'config/variables';
import EventBus from 'utils/eventbus';

const TranslationContext = createContext();

export function TranslationProvider({ children, initialLanguage }) {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const i18nInstance = useRef(initTranslations(initialLanguage));

  // Update i18n instance when language changes
  useEffect(() => {
    if (currentLanguage !== initialLanguage) {
      i18nInstance.current = initTranslations(currentLanguage);
    }
    variables.language = i18nInstance.current;
    variables.languagecode = currentLanguage;
    document.documentElement.lang = currentLanguage.replace('_', '-');
  }, [currentLanguage, initialLanguage]);

  // Change language function
  const changeLanguage = useCallback(
    (newLanguage) => {
      // Update the i18n instance
      i18nInstance.current = initTranslations(newLanguage);
      variables.language = i18nInstance.current;
      variables.languagecode = newLanguage;
      document.documentElement.lang = newLanguage.replace('_', '-');

      // Update tab name if it's still the default
      const currentTabName = localStorage.getItem('tabName');
      const oldDefaultTabName = i18nInstance.current?.getMessage(currentLanguage, 'tabname');

      if (currentTabName === oldDefaultTabName || !currentTabName) {
        const newTabName =
          translations[newLanguage.replace('-', '_')]?.tabname ||
          i18nInstance.current?.getMessage(newLanguage, 'tabname') ||
          'Mue';
        localStorage.setItem('tabName', newTabName);
        document.title = newTabName;
      }

      // Update language in localStorage
      localStorage.setItem('language', newLanguage);

      // Clear weather cache so it refreshes with the new language
      localStorage.removeItem('currentWeather');

      // Update state to trigger re-render
      setCurrentLanguage(newLanguage);
    },
    [currentLanguage],
  );

  // Single translation function - the main API
  const t = useCallback(
    (key, optional = {}) => {
      if (!i18nInstance.current) {
        return key;
      }
      return i18nInstance.current.getMessage(currentLanguage, key, optional);
    },
    [currentLanguage],
  );

  // Listen for EventBus language change events (for backward compatibility)
  useEffect(() => {
    const handleLanguageChange = (data) => {
      if (data?.language) {
        changeLanguage(data.language);
      }
    };

    EventBus.on('languageChange', handleLanguageChange);

    return () => {
      EventBus.off('languageChange', handleLanguageChange);
    };
  }, [changeLanguage]);

  // Update variables.getMessage for backward compatibility
  useEffect(() => {
    variables.getMessage = (key, optional = {}) => t(key, optional);
  }, [t]);

  const value = useMemo(
    () => ({
      language: currentLanguage,
      languagecode: currentLanguage, // Alias for backward compatibility
      changeLanguage,
      t,
    }),
    [currentLanguage, changeLanguage, t],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Convenience hook - just returns the t function
export function useT() {
  const { t } = useTranslation();
  return t;
}
