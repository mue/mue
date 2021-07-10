import React from 'react';

// Navbar
import Settings from '@material-ui/icons/SettingsRounded';
import Addons from '@material-ui/icons/Widgets';
import Marketplace from '@material-ui/icons/ShoppingBasket';

// Settings
import Time from '@material-ui/icons/AccessAlarm';
import Greeting from '@material-ui/icons/EmojiPeopleOutlined';
import Quote from '@material-ui/icons/FormatQuoteOutlined';
import Background from '@material-ui/icons/PhotoOutlined';
import Search from '@material-ui/icons/Search';
import Appearance from '@material-ui/icons/FormatPaintOutlined';
import Language from '@material-ui/icons/Translate';
import Changelog from '@material-ui/icons/NewReleasesOutlined';
import About from '@material-ui/icons/InfoOutlined';
import Experimental from '@material-ui/icons/BugReportOutlined';
import Order from '@material-ui/icons/List';
import Weather from '@material-ui/icons/CloudOutlined';
import Advanced from '@material-ui/icons/SettingsOutlined';
import QuickLinks from '@material-ui/icons/Link';

// Addons
import Sideload from '@material-ui/icons/Code';
import Added from '@material-ui/icons/AddCircleOutline';

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
    case settings.experimental.title: icon = <Experimental/>; divider = true; break;
    case settings.changelog: icon = <Changelog/>; break;
    case settings.about.title: icon = <About/>; break;

    // Addons
    case addons.added: icon = <Added/>; break;
    case addons.sideload: icon = <Sideload/>; break;

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

export default React.memo(Tab);
