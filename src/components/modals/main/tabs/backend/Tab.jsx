import variables from 'modules/variables';
import { memo } from 'react';
import {
  SettingsRounded as Settings,
  Widgets as Addons,
  ShoppingBasket as Marketplace,
  AccessAlarm as Time,
  EmojiPeopleOutlined as Greeting,
  FormatQuoteOutlined as Quote,
  PhotoOutlined as Background,
  Search,
  FormatPaintOutlined as Appearance,
  Translate as Language,
  NewReleasesOutlined as Changelog,
  InfoOutlined as About,
  BugReportOutlined as Experimental,
  List as Order,
  CloudOutlined as Weather,
  SettingsOutlined as Advanced,
  Link as QuickLinks,
  AssessmentOutlined as Stats,
  Code as Sideload,
  AddCircleOutline as Added,
  CreateNewFolderOutlined as Create,
  KeyboardAltOutlined as Keybinds
} from '@material-ui/icons';

function Tab({ label, currentTab, onClick, navbarTab }) {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;

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

  let icon, divider;
  switch (label) {
    case getMessage(languagecode, 'modals.main.navbar.settings'): icon = <Settings/>; break;
    case getMessage(languagecode, 'modals.main.navbar.addons'): icon = <Addons/>; break;
    case getMessage(languagecode, 'modals.main.navbar.marketplace'): icon = <Marketplace/>; break;

    case getMessage(languagecode, 'modals.main.settings.sections.time.title'): icon = <Time/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.greeting.title'): icon = <Greeting/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.quote.title'): icon = <Quote/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.background.title'): icon = <Background/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.search.title'): icon = <Search/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.weather.title'): icon = <Weather/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.quicklinks.title'): icon = <QuickLinks/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.appearance.title'): icon = <Appearance/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.order.title'): icon = <Order/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.language.title'): icon = <Language/>; divider = true; break;
    case getMessage(languagecode, 'modals.main.settings.sections.advanced.title'): icon = <Advanced/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.keybinds.title'): icon = <Keybinds/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.stats.title'): icon = <Stats/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.experimental.title'): icon = <Experimental/>; divider = true; break;
    case getMessage(languagecode, 'modals.main.settings.sections.changelog'): icon = <Changelog/>; break;
    case getMessage(languagecode, 'modals.main.settings.sections.about.title'): icon = <About/>; break;

    case getMessage(languagecode, 'modals.main.addons.added'): icon = <Added/>; break;
    case getMessage(languagecode, 'modals.main.addons.sideload'): icon = <Sideload/>; break;
    case getMessage(languagecode, 'modals.main.addons.create.title'): icon = <Create/>; break;

    case getMessage(languagecode, 'modals.main.marketplace.photo_packs'): icon = <Background/>; break;
    case getMessage(languagecode, 'modals.main.marketplace.quote_packs'): icon = <Quote/>; break;
    case getMessage(languagecode, 'modals.main.marketplace.preset_settings'): icon = <Advanced/>; break;

    default: break;
  }

  if (label === getMessage(languagecode, 'modals.main.settings.sections.experimental.title')) {
    if (localStorage.getItem('experimental') === 'false') {
      return <hr/>;
    }
  }

  return (
    <>
      <li className={className} onClick={() => onClick(label)}>
      {icon} <span>{label}</span>
      </li>
      {(divider === true) ? <hr/> : null}
    </>
  );
}

export default memo(Tab);
