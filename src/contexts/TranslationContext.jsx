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

  useEffect(() => {
    if (currentLanguage !== initialLanguage) {
      i18nInstance.current = initTranslations(currentLanguage);
    }
    variables.language = i18nInstance.current;
    variables.languagecode = currentLanguage;
    document.documentElement.lang = currentLanguage.replace('_', '-');
  }, [currentLanguage, initialLanguage]);

  const changeLanguage = useCallback(
    (newLanguage) => {
      i18nInstance.current = initTranslations(newLanguage);
      variables.language = i18nInstance.current;
      variables.languagecode = newLanguage;
      document.documentElement.lang = newLanguage.replace('_', '-');

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

      localStorage.setItem('language', newLanguage);

      localStorage.removeItem('currentWeather');

      setCurrentLanguage(newLanguage);
    },
    [currentLanguage],
  );

  const t = useCallback(
    (key, optional = {}) => {
      if (!i18nInstance.current) {
        return key;
      }
      return i18nInstance.current.getMessage(currentLanguage, key, optional);
    },
    [currentLanguage],
  );

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

  useEffect(() => {
    variables.getMessage = (key, optional = {}) => t(key, optional);
  }, [t]);

  const value = useMemo(
    () => ({
      language: currentLanguage,
      languagecode: currentLanguage,
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

export function useT() {
  const { t } = useTranslation();
  return t;
}
