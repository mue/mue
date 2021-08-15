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
  CreateNewFolderOutlined as Create
} from '@material-ui/icons';

function Tab(props) {
  let className = 'tab-list-item';
  if (props.currentTab === props.label) {
    className += ' tab-list-active';
  }

  if (props.navbar === true) {
    className = 'navbar-item';
    if (props.currentTab === props.label) {
      className += ' navbar-item-active';
    }
  }

  const settings = window.language.modals.main.settings.sections;
  const { navbar, marketplace, addons } = window.language.modals.main;

  let icon, divider;
  switch (props.label) {
    // Navbar
    case navbar.settings: icon = <Settings/>; break;
    case navbar.addons: icon = <Addons/>; break;
    case navbar.marketplace: icon = <Marketplace/>; break;

    // Settings
    case settings.time.title: icon = <Time/>; break;
    case settings.greeting.title: icon = <Greeting/>; break;
    case settings.quote.title: icon = <Quote/>; break;
    case settings.background.title: icon = <Background/>; break;
    case settings.search.title: icon = <Search/>; break;
    case settings.weather.title: icon = <Weather/>; break;
    case settings.quicklinks.title: icon = <QuickLinks/>; break;
    case settings.appearance.title: icon = <Appearance/>; break;
    case settings.order.title: icon = <Order/>; break;
    case settings.language.title: icon = <Language/>; divider = true; break;
    case settings.advanced.title: icon = <Advanced/>; break;
    case settings.stats.title: icon = <Stats/>; break;
    case settings.experimental.title: icon = <Experimental/>; divider = true; break;
    case settings.changelog: icon = <Changelog/>; break;
    case settings.about.title: icon = <About/>; break;

    // Addons
    case addons.added: icon = <Added/>; break;
    case addons.sideload: icon = <Sideload/>; break;
    case addons.create.title: icon = <Create/>; break;

    // Marketplace
    case marketplace.photo_packs: icon = <Background/>; break;
    case marketplace.quote_packs: icon = <Quote/>; break;
    case marketplace.preset_settings: icon = <Advanced/>; break;

    default: break;
  }

  if (props.label === settings.experimental.title) {
    if (localStorage.getItem('experimental') === 'false') {
      return <hr/>;
    }
  }

  return (
    <>
      <li className={className} onClick={() => props.onClick(props.label)}>
      {icon} <span>{props.label}</span>
      </li>
      {(divider === true) ? <hr/> : null}
    </>
  );
}

export default memo(Tab);
