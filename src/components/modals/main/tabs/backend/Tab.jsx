import React from 'react';

// Navbar
import Settings from '@material-ui/icons/Settings';
import Addons from '@material-ui/icons/Widgets';
import Marketplace from '@material-ui/icons/ShoppingBasket';

// Settings
import Time from '@material-ui/icons/AccessAlarm';
import Greeting from '@material-ui/icons/EmojiPeople';
import Quote from '@material-ui/icons/FormatQuote';
import Background from '@material-ui/icons/Photo';
import Search from '@material-ui/icons/Search';
import Appearance from '@material-ui/icons/FormatPaint';
import Language from '@material-ui/icons/Translate';
import Changelog from '@material-ui/icons/NewReleasesRounded';
import About from '@material-ui/icons/Info';
import Experimental from '@material-ui/icons/BugReport';
import Order from '@material-ui/icons/List';

// Store
import Colors from '@material-ui/icons/ColorLens';
import Plugins from '@material-ui/icons/Widgets';
import Added from '@material-ui/icons/AddCircle';

export default function Tab(props) {
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

  let icon, divider;
  switch (props.label) {
    // Navbar
    case 'Settings': icon = <Settings/>; break;
    case 'My Add-ons': icon = <Addons/>; break;
    case 'Marketplace': icon = <Marketplace/>; break;

    // Settings
    case 'Time': icon = <Time/>; break;
    case 'Greeting': icon = <Greeting/>; break;
    case 'Quote': icon = <Quote/>; break;
    case 'Background': icon = <Background/>; break;
    case 'Search': icon = <Search/>; break;
    case 'Appearance': icon = <Appearance/>; break;
    case 'Order': icon = <Order/>; break;
    case 'Language': icon = <Language/>; divider = true; break;
    case 'Advanced': icon = <Settings/>; break;
    case 'Experimental': icon = <Experimental/>; divider = true; break;
    case 'Change Log': icon = <Changelog/>; break;
    case 'About': icon = <About/>; break;

    // Store
    case 'Themes': icon = <Colors/>; break;
    case 'Photo Packs': icon = <Background/>; break;
    case 'Quote Packs': icon = <Quote/>; break;
    case 'Plugins': icon = <Plugins/>; divider = true; break;
    case 'Added': icon = <Added/>; break;

    default: break;
  }

  return (
    <React.Fragment>
      <li className={className} onClick={() => props.onClick(props.label)}>
      {icon} <span>{props.label}</span>
      </li>
      {(divider === true) ? <div><hr/></div> : null}
    </React.Fragment>
  )
}
