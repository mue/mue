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
  MdOutlineExtension as Added,
  MdAddCircleOutline as Create,
  MdViewAgenda as Overview,
  MdCollectionsBookmark as Collections,
} from 'react-icons/md';

const iconMapping = {
  [variables.getMessage('modals.main.marketplace.product.overview')]: <Overview />,
  [variables.getMessage('modals.main.navbar.settings')]: <Settings />,
  [variables.getMessage('modals.main.navbar.addons')]: <Addons />,
  [variables.getMessage('modals.main.navbar.marketplace')]: <Marketplace />,
  [variables.getMessage('modals.main.settings.sections.appearance.navbar.title')]: <Navbar />,
  [variables.getMessage('modals.main.settings.sections.greeting.title')]: <Greeting />,
  [variables.getMessage('modals.main.settings.sections.time.title')]: <Time />,
  [variables.getMessage('modals.main.settings.sections.quicklinks.title')]: <QuickLinks />,
  [variables.getMessage('modals.main.settings.sections.quote.title')]: <Quote />,
  [variables.getMessage('modals.main.settings.sections.date.title')]: <Date />,
  [variables.getMessage('modals.main.settings.sections.message.title')]: <Message />,
  [variables.getMessage('modals.main.settings.sections.background.title')]: <Background />,
  [variables.getMessage('modals.main.settings.sections.search.title')]: <MdSearch />,
  [variables.getMessage('modals.main.settings.sections.weather.title')]: <Weather />,
  [variables.getMessage('modals.main.settings.sections.appearance.title')]: <Appearance />,
  [variables.getMessage('modals.main.settings.sections.language.title')]: <Language />,
  [variables.getMessage('modals.main.settings.sections.advanced.title')]: <Advanced />,
  [variables.getMessage('modals.main.settings.sections.stats.title')]: <Stats />,
  [variables.getMessage('modals.main.settings.sections.experimental.title')]: <Experimental />,
  [variables.getMessage('modals.main.settings.sections.changelog.title')]: <Changelog />,
  [variables.getMessage('modals.main.settings.sections.about.title')]: <About />,
  [variables.getMessage('modals.main.addons.added')]: <Added />,
  [variables.getMessage('modals.main.addons.create.title')]: <Create />,
  [variables.getMessage('modals.main.marketplace.all')]: <Addons />,
  [variables.getMessage('modals.main.marketplace.photo_packs')]: <Background />,
  [variables.getMessage('modals.main.marketplace.quote_packs')]: <Quote />,
  [variables.getMessage('modals.main.marketplace.preset_settings')]: <Advanced />,
  [variables.getMessage('modals.main.marketplace.collections')]: <Collections />,
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
  const divider = [
    variables.getMessage('modals.main.settings.sections.weather.title'),
    variables.getMessage('modals.main.settings.sections.language.title'),
    variables.getMessage('modals.main.marketplace.all'),
    variables.getMessage('modals.main.settings.sections.experimental.title'),
  ].includes(label);

  const mue = [
    variables.getMessage('modals.main.marketplace.product.overview'),
    variables.getMessage('modals.main.addons.added'),
    variables.getMessage('modals.main.marketplace.all'),
  ].includes(label);

  if (
    label === variables.getMessage('modals.main.settings.sections.experimental.title') &&
    !isExperimental
  ) {
    return <hr />;
  }

  return (
    <>
      {/*{mue && <span className="mainTitle">Mue</span>}*/}
      <button className={className} onClick={() => onClick(label)}>
        {icon} <span>{label}</span>
      </button>
      {/*{divider && <hr />}*/}
    </>
  );
}

export default memo(Tab);
