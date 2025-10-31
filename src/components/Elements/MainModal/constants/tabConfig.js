import {
  MdSettings,
  MdWidgets,
  MdShoppingBasket,
  MdTune,
  MdBookmarks,
  MdExplore,
  MdMenu,
  MdEmojiPeople,
  MdAccessAlarm,
  MdOutlineFormatQuote,
  MdLink,
  MdDateRange,
  MdOutlineTextsms,
  MdOutlinePhoto,
  MdSearch,
  MdCloudQueue,
  MdFormatPaint,
  MdTranslate,
  MdOutlineSettings,
  MdBugReport,
  MdOutlineAssessment,
  MdOutlineNewReleases,
  MdInfoOutline,
  MdOutlineExtension,
  MdAddCircleOutline,
  MdViewAgenda,
  MdCollectionsBookmark,
} from 'react-icons/md';

// Tab type constants
export const TAB_TYPES = {
  SETTINGS: 'settings',
  LIBRARY: 'library',
  DISCOVER: 'discover',
};

// Icon component mapping - using component references instead of elements
export const ICON_COMPONENTS = {
  SETTINGS: MdTune,
  LIBRARY: MdBookmarks,
  DISCOVER: MdExplore,
  NAVBAR: MdMenu,
  GREETING: MdEmojiPeople,
  TIME: MdAccessAlarm,
  QUOTE: MdOutlineFormatQuote,
  QUICKLINKS: MdLink,
  DATE: MdDateRange,
  MESSAGE: MdOutlineTextsms,
  BACKGROUND: MdOutlinePhoto,
  SEARCH: MdSearch,
  WEATHER: MdCloudQueue,
  APPEARANCE: MdFormatPaint,
  LANGUAGE: MdTranslate,
  ADVANCED: MdOutlineSettings,
  EXPERIMENTAL: MdBugReport,
  STATS: MdOutlineAssessment,
  CHANGELOG: MdOutlineNewReleases,
  ABOUT: MdInfoOutline,
  ADDED: MdOutlineExtension,
  CREATE: MdAddCircleOutline,
  OVERVIEW: MdViewAgenda,
  COLLECTIONS: MdCollectionsBookmark,
};

// Message keys for icon mapping
export const MESSAGE_KEYS = {
  OVERVIEW: 'modals.main.marketplace.product.overview',
  SETTINGS: 'modals.main.navbar.settings',
  LIBRARY: 'modals.main.navbar.library',
  DISCOVER: 'modals.main.navbar.discover',
  NAVBAR: 'modals.main.settings.sections.appearance.navbar.title',
  GREETING: 'modals.main.settings.sections.greeting.title',
  TIME: 'modals.main.settings.sections.time.title',
  QUICKLINKS: 'modals.main.settings.sections.quicklinks.title',
  QUOTE: 'modals.main.settings.sections.quote.title',
  DATE: 'modals.main.settings.sections.date.title',
  MESSAGE: 'modals.main.settings.sections.message.title',
  BACKGROUND: 'modals.main.settings.sections.background.title',
  SEARCH: 'modals.main.settings.sections.search.title',
  WEATHER: 'modals.main.settings.sections.weather.title',
  APPEARANCE: 'modals.main.settings.sections.appearance.title',
  LANGUAGE: 'modals.main.settings.sections.language.title',
  ADVANCED: 'modals.main.settings.sections.advanced.title',
  STATS: 'modals.main.settings.sections.stats.title',
  EXPERIMENTAL: 'modals.main.settings.sections.experimental.title',
  CHANGELOG: 'modals.main.settings.sections.changelog.title',
  ABOUT: 'modals.main.settings.sections.about.title',
  ADDED: 'modals.main.addons.added',
  CREATE: 'modals.main.addons.create.title',
  ALL_MARKETPLACE: 'modals.main.marketplace.all',
  PHOTO_PACKS: 'modals.main.marketplace.photo_packs',
  QUOTE_PACKS: 'modals.main.marketplace.quote_packs',
  PRESET_SETTINGS: 'modals.main.marketplace.preset_settings',
  COLLECTIONS: 'modals.main.marketplace.collections',
};

// Helper to get icon component by translated label
// This function builds a map at runtime using variables.getMessage
export const getIconComponent = (label, variables) => {
  const iconMap = {
    [variables.getMessage(MESSAGE_KEYS.OVERVIEW)]: ICON_COMPONENTS.OVERVIEW,
    [variables.getMessage(MESSAGE_KEYS.SETTINGS)]: ICON_COMPONENTS.SETTINGS,
    [variables.getMessage(MESSAGE_KEYS.LIBRARY)]: ICON_COMPONENTS.LIBRARY,
    [variables.getMessage(MESSAGE_KEYS.DISCOVER)]: ICON_COMPONENTS.DISCOVER,
    [variables.getMessage(MESSAGE_KEYS.NAVBAR)]: ICON_COMPONENTS.NAVBAR,
    [variables.getMessage(MESSAGE_KEYS.GREETING)]: ICON_COMPONENTS.GREETING,
    [variables.getMessage(MESSAGE_KEYS.TIME)]: ICON_COMPONENTS.TIME,
    [variables.getMessage(MESSAGE_KEYS.QUICKLINKS)]: ICON_COMPONENTS.QUICKLINKS,
    [variables.getMessage(MESSAGE_KEYS.QUOTE)]: ICON_COMPONENTS.QUOTE,
    [variables.getMessage(MESSAGE_KEYS.DATE)]: ICON_COMPONENTS.DATE,
    [variables.getMessage(MESSAGE_KEYS.MESSAGE)]: ICON_COMPONENTS.MESSAGE,
    [variables.getMessage(MESSAGE_KEYS.BACKGROUND)]: ICON_COMPONENTS.BACKGROUND,
    [variables.getMessage(MESSAGE_KEYS.SEARCH)]: ICON_COMPONENTS.SEARCH,
    [variables.getMessage(MESSAGE_KEYS.WEATHER)]: ICON_COMPONENTS.WEATHER,
    [variables.getMessage(MESSAGE_KEYS.APPEARANCE)]: ICON_COMPONENTS.APPEARANCE,
    [variables.getMessage(MESSAGE_KEYS.LANGUAGE)]: ICON_COMPONENTS.LANGUAGE,
    [variables.getMessage(MESSAGE_KEYS.ADVANCED)]: ICON_COMPONENTS.ADVANCED,
    [variables.getMessage(MESSAGE_KEYS.STATS)]: ICON_COMPONENTS.STATS,
    [variables.getMessage(MESSAGE_KEYS.EXPERIMENTAL)]: ICON_COMPONENTS.EXPERIMENTAL,
    [variables.getMessage(MESSAGE_KEYS.CHANGELOG)]: ICON_COMPONENTS.CHANGELOG,
    [variables.getMessage(MESSAGE_KEYS.ABOUT)]: ICON_COMPONENTS.ABOUT,
    [variables.getMessage(MESSAGE_KEYS.ADDED)]: ICON_COMPONENTS.ADDED,
    [variables.getMessage(MESSAGE_KEYS.CREATE)]: ICON_COMPONENTS.CREATE,
    [variables.getMessage(MESSAGE_KEYS.ALL_MARKETPLACE)]: ICON_COMPONENTS.LIBRARY,
    [variables.getMessage(MESSAGE_KEYS.PHOTO_PACKS)]: ICON_COMPONENTS.BACKGROUND,
    [variables.getMessage(MESSAGE_KEYS.QUOTE_PACKS)]: ICON_COMPONENTS.QUOTE,
    [variables.getMessage(MESSAGE_KEYS.PRESET_SETTINGS)]: ICON_COMPONENTS.ADVANCED,
    [variables.getMessage(MESSAGE_KEYS.COLLECTIONS)]: ICON_COMPONENTS.COLLECTIONS,
  };

  return iconMap[label];
};

// Navbar configuration
export const NAVBAR_BUTTONS = [
  {
    tab: TAB_TYPES.SETTINGS,
    icon: ICON_COMPONENTS.SETTINGS,
    messageKey: 'modals.main.navbar.settings',
  },
  {
    tab: TAB_TYPES.LIBRARY,
    icon: ICON_COMPONENTS.LIBRARY,
    messageKey: 'modals.main.navbar.library',
  },
  {
    tab: TAB_TYPES.DISCOVER,
    icon: ICON_COMPONENTS.DISCOVER,
    messageKey: 'modals.main.navbar.discover',
  },
];

// Labels that should have dividers after them
export const DIVIDER_LABELS = [
  'modals.main.settings.sections.weather.title',
  'modals.main.settings.sections.language.title',
  'modals.main.marketplace.all',
  'modals.main.settings.sections.experimental.title',
];
