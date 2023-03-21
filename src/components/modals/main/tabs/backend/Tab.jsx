import variables from 'modules/variables';
import { memo } from 'react';
import PropTypes from 'prop-types';
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
  MdAddCircleOutline as Added,
  MdAddCircleOutline as Create,
  MdViewAgenda as Overview,
  MdCollectionsBookmark as Collections,
} from 'react-icons/md';

function Tab({ label, currentTab, onClick, navbarTab }) {
  let className = 'tab-list-item';
  if (currentTab === label) {
    className += ' tab-list-active';
  }

  if (navbarTab === true) {
    className = 'navbar-item';
    if (currentTab === label) {
      className += ' navbar-item-active';
    }
  }

  let icon, divider, mue;
  switch (label) {
    case variables.getMessage('modals.main.marketplace.product.overview'):
      icon = <Overview />;
      mue = true;
      break;
    case variables.getMessage('modals.main.navbar.settings'):
      icon = <Settings />;
      break;
    case variables.getMessage('modals.main.navbar.addons'):
      icon = <Addons />;
      break;
    case variables.getMessage('modals.main.navbar.marketplace'):
      icon = <Marketplace />;
      break;

    case variables.getMessage('modals.main.settings.sections.appearance.navbar.title'):
      icon = <Navbar />;
      break;
    case variables.getMessage('modals.main.settings.sections.greeting.title'):
      icon = <Greeting />;
      break;
    case variables.getMessage('modals.main.settings.sections.time.title'):
      icon = <Time />;
      break;
    case variables.getMessage('modals.main.settings.sections.quicklinks.title'):
      icon = <QuickLinks />;
      break;
    case variables.getMessage('modals.main.settings.sections.quote.title'):
      icon = <Quote />;
      break;
    case variables.getMessage('modals.main.settings.sections.date.title'):
      icon = <Date />;
      break;
    case variables.getMessage('modals.main.settings.sections.message.title'):
      icon = <Message />;
      break;
    case variables.getMessage('modals.main.settings.sections.background.title'):
      icon = <Background />;
      break;
    case variables.getMessage('modals.main.settings.sections.search.title'):
      icon = <MdSearch />;
      break;
    case variables.getMessage('modals.main.settings.sections.weather.title'):
      icon = <Weather />;
      divider = true;
      break;
    case variables.getMessage('modals.main.settings.sections.appearance.title'):
      icon = <Appearance />;
      break;
    case variables.getMessage('modals.main.settings.sections.language.title'):
      icon = <Language />;
      divider = true;
      break;
    case variables.getMessage('modals.main.settings.sections.advanced.title'):
      icon = <Advanced />;
      break;
    case variables.getMessage('modals.main.settings.sections.stats.title'):
      icon = <Stats />;
      break;
    case variables.getMessage('modals.main.settings.sections.experimental.title'):
      icon = <Experimental />;
      divider = true;
      break;
    case variables.getMessage('modals.main.settings.sections.changelog.title'):
      icon = <Changelog />;
      break;
    case variables.getMessage('modals.main.settings.sections.about.title'):
      icon = <About />;
      break;

    case variables.getMessage('modals.main.addons.added'):
      mue = true;
      icon = <Added />;
      break;
    case variables.getMessage('modals.main.addons.create.title'):
      icon = <Create />;
      break;

    case variables.getMessage('modals.main.marketplace.all'):
      icon = <Addons />;
      divider = true;
      mue = true;
      break;
    case variables.getMessage('modals.main.marketplace.photo_packs'):
      icon = <Background />;
      break;
    case variables.getMessage('modals.main.marketplace.quote_packs'):
      icon = <Quote />;
      break;
    case variables.getMessage('modals.main.marketplace.preset_settings'):
      icon = <Advanced />;
      break;
    case variables.getMessage('modals.main.marketplace.collections'):
      icon = <Collections />;
      break;

    case variables.getMessage('modals.main.loading'):
      mue = true;
      break;

    default:
      break;
  }

  if (label === variables.getMessage('modals.main.settings.sections.experimental.title')) {
    if (localStorage.getItem('experimental') === 'false') {
      return <hr />;
    }
  }

  return (
    <>
      {mue === true ? <span className="mainTitle">Mue</span> : null}
      <button className={className} onClick={() => onClick(label)}>
        {icon} <span>{label}</span>
      </button>
      {divider === true ? <hr /> : null}
    </>
  );
}

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  currentTab: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  navbarTab: PropTypes.bool,
};

export default memo(Tab);
