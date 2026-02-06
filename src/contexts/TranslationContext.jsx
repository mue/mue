import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  initTranslations,
  loadTranslationWithFallback,
  getLoadedTranslation,
} from 'lib/translations';
import variables from 'config/variables';
import EventBus from 'utils/eventbus';

const RTL_LANGUAGES = ['ar', 'arz', 'azb', 'fa', 'peo'];
const isRTLLanguage = (lang) => RTL_LANGUAGES.includes(lang.split('_')[0]);

const TranslationContext = createContext();

export function TranslationProvider({ children, initialLanguage, initialTranslations }) {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const i18nInstance = useRef(initTranslations(initialLanguage, initialTranslations));

  useEffect(() => {
    variables.language = i18nInstance.current;
    variables.languagecode = currentLanguage;
    document.documentElement.lang = currentLanguage.replace('_', '-');
    document.documentElement.dir = isRTLLanguage(currentLanguage) ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  const changeLanguage = useCallback(
    async (newLanguage) => {
      setIsLoading(true);
      try {
        const translations = await loadTranslationWithFallback(newLanguage);
        const newI18n = initTranslations(newLanguage, translations);

        const currentTabName = localStorage.getItem('tabName');
        const oldDefaultTabName = i18nInstance.current?.getMessage(currentLanguage, 'tabname');

        i18nInstance.current = newI18n;
        variables.language = newI18n;
        variables.languagecode = newLanguage;
        document.documentElement.lang = newLanguage.replace('_', '-');
        document.documentElement.dir = isRTLLanguage(newLanguage) ? 'rtl' : 'ltr';

        if (currentTabName === oldDefaultTabName || !currentTabName) {
          const loadedTranslation = getLoadedTranslation(newLanguage);
          const newTabName =
            loadedTranslation?.tabname || newI18n.getMessage(newLanguage, 'tabname') || 'Mue';
          localStorage.setItem('tabName', newTabName);
          document.title = newTabName;
        }

        localStorage.setItem('language', newLanguage);
        localStorage.removeItem('currentWeather');

        setCurrentLanguage(newLanguage);
      } catch (error) {
        console.error('Failed to load language:', error);
      } finally {
        setIsLoading(false);
      }
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
      isLoading,
      t,
    }),
    [currentLanguage, changeLanguage, isLoading, t],
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
