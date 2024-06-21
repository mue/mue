import variables from 'config/variables';
import { memo, useState, useEffect } from 'react';
import {
  MdSettings as Settings,
  MdWidgets as Addons,
  MdShoppingBasket as Marketplace,
  MdMenu as Navbar,
  MdEmojiPeople as Greeting,
  MdAccessAlarm as Time,
  MdOutlineFormatQuote as Quote,
  MdLink as QuickLinks,
  MdDateRange as Date,
  MdOutlineTextsms as Message,
  MdOutlinePhoto as Background,
  MdSearch,
  MdCloudQueue as Weather,
  MdFormatPaint as Appearance,
  MdTranslate as Language,
  MdOutlineSettings as Advanced,
  MdBugReport as Experimental,
  MdOutlineAssessment as Stats,
  MdOutlineNewReleases as Changelog,
  MdInfoOutline as About,
  MdSpaceDashboard as Added,
  MdAddCircleOutline as Create,
  MdViewAgenda as Overview,
  MdCollectionsBookmark as Collections,
} from 'react-icons/md';

const iconMapping = {
  [variables.getMessage('marketplace:product.overview')]: <Overview />,
  [variables.getMessage('modals.main.navbar.settings')]: <Settings />,
  [variables.getMessage('modals.main.navbar.addons')]: <Addons />,
  [variables.getMessage('modals.main.navbar.marketplace')]: <Marketplace />,
  [variables.getMessage('settings:sections.appearance.navbar.title')]: <Navbar />,
  [variables.getMessage('settings:sections.greeting.title')]: <Greeting />,
  [variables.getMessage('settings:sections.time.title')]: <Time />,
  [variables.getMessage('settings:sections.quicklinks.title')]: <QuickLinks />,
  [variables.getMessage('settings:sections.quote.title')]: <Quote />,
  [variables.getMessage('settings:sections.date.title')]: <Date />,
  [variables.getMessage('settings:sections.message.title')]: <Message />,
  [variables.getMessage('settings:sections.background.title')]: <Background />,
  [variables.getMessage('settings:sections.search.title')]: <MdSearch />,
  [variables.getMessage('settings:sections.weather.title')]: <Weather />,
  [variables.getMessage('settings:sections.appearance.title')]: <Appearance />,
  [variables.getMessage('settings:sections.language.title')]: <Language />,
  [variables.getMessage('settings:sections.advanced.title')]: <Advanced />,
  [variables.getMessage('settings:sections.stats.title')]: <Stats />,
  [variables.getMessage('settings:sections.experimental.title')]: <Experimental />,
  [variables.getMessage('settings:sections.changelog.title')]: <Changelog />,
  [variables.getMessage('settings:sections.about.title')]: <About />,
  [variables.getMessage('addons:added')]: <Added />,
  [variables.getMessage('addons:create.title')]: <Create />,
  [variables.getMessage('marketplace:all')]: <Addons />,
  [variables.getMessage('marketplace:photo_packs')]: <Background />,
  [variables.getMessage('marketplace:quote_packs')]: <Quote />,
  [variables.getMessage('marketplace:preset_settings')]: <Advanced />,
  [variables.getMessage('marketplace:collections')]: <Collections />,
};

function Tab({ label, currentTab, onClick, navbarTab }) {
  const [isExperimental, setIsExperimental] = useState(true);

  useEffect(() => {
    setIsExperimental(localStorage.getItem('experimental') !== 'false');
  }, []);

  let className = navbarTab ? 'navbar-item' : 'tab-list-item';
  if (currentTab === label) {
    className += navbarTab ? ' navbar-item-active' : ' tab-list-active';
  }

  const icon = iconMapping[label];

  if (
    label === variables.getMessage('settings:sections.experimental.title') &&
    !isExperimental
  ) {
    return null;
  }

  return (
    <button className={className} onClick={() => onClick(label)}>
      {icon} <span>{label}</span>
    </button>
  );
}

export default memo(Tab);
