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

import Colors from '@material-ui/icons/ColorLens';
import Plugins from '@material-ui/icons/Widgets';
import Added from '@material-ui/icons/AddCircle';

export default class Tab extends React.PureComponent {
      onClick = () => {
        this.props.onClick(this.props.label);
      };

      render() {
        let className = 'tab-list-item';
        if (this.props.currentTab === this.props.label) {
          className += ' tab-list-active';
        }

        if (this.props.navbar === true) {
          className = 'navbar-item';
          if (this.props.currentTab === this.props.label) {
            className += ' navbar-item-active';
          }
        }

        let icon, divider;
        switch (this.props.label) {
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
          case 'Language': 
            icon = <Language/>; 
            divider = <div><hr/></div>;
          break;
          case 'Change Log': icon = <Changelog/>; break;
          case 'About': icon = <About/>; break; 
          // Store
          case 'Themes': icon = <Colors/>; break; 
          case 'Photo Packs': icon = <Background/>; break; 
          case 'Quotes Packs': icon = <Quote/>; break;
          case 'Plugins':
            icon = <Plugins/>;
            divider = <div><hr/></div>;
            break;
          case 'Added': icon = <Added/>; break;
          default: break;
        }

        return (
          <React.Fragment>
            <li className={className} onClick={this.onClick}>
            {icon} <span>{this.props.label}</span>
          </li>
          {divider}
          </React.Fragment>
        )
   }
}                                    