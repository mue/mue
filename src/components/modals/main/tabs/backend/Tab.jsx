import React from 'react';

// Navbar
import Settings from '@material-ui/icons/Settings';
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
import Sideload from '@material-ui/icons/Code';

// Store
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

  const language = window.language.modals.main.settings.sections;
  const navbarlanguage = window.language.modals.main.navbar;
  const marketplacelanguage = window.language.modals.main.marketplace;
  const addonslanguage = window.language.modals.main.addons;

  let icon, divider;
  switch (props.label) {
    // Navbar
    case navbarlanguage.settings: icon = <Settings/>; break;
    case navbarlanguage.addons: icon = <Addons/>; break;
    case navbarlanguage.marketplace: icon = <Marketplace/>; break;

    // Settings
    case language.time.title: icon = <Time/>; break;
    case language.greeting.title: icon = <Greeting/>; break;
    case language.quote.title: icon = <Quote/>; break;
    case language.background.title: icon = <Background/>; break;
    case language.search.title: icon = <Search/>; break;
    case language.weather.title: icon = <Weather/>; break;
    case language.quicklinks.title: icon = <QuickLinks/>; break;
    case language.appearance.title: icon = <Appearance/>; break;
    case language.order.title: icon = <Order/>; break;
    case language.language.title: icon = <Language/>; divider = true; break;
    case language.advanced.title: icon = <Advanced/>; break;
    case language.experimental.title: icon = <Experimental/>; divider = true; break;
    case language.changelog: icon = <Changelog/>; break;
    case language.about.title: icon = <About/>; break;

    // Store
    case marketplacelanguage.photo_packs: icon = <Background/>; break;
    case marketplacelanguage.quote_packs: icon = <Quote/>; break;
    case addonslanguage.added: icon = <Added/>; break;
    case addonslanguage.sideload: icon = <Sideload/>; break;

    default: break;
  }

  if (props.label === language.experimental.title) {
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