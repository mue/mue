import React from 'react';

import Settings from './tabs/Settings';
import Addons from './tabs/Addons';
import Marketplace from './tabs/Marketplace';

import SettingsIcon from '@material-ui/icons/Settings';
import AddonsIcon from '@material-ui/icons/Widgets';
import MarketplaceIcon from '@material-ui/icons/ShoppingBasket';

export default class MainModal extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            tab: '',
            currentTab: ''
        };
        this.tabs = {
          settings: <Settings language={this.props.language.settings} toastLanguage={this.props.language.toasts} />,
          addons: <Addons language={this.props.language.addons} marketplaceLanguage={this.props.language.marketplace} toastLanguage={this.props.language.toasts} openMarketplace={() => this.changeEnabled('marketplace')}/>,
          marketplace: <Marketplace language={this.props.language.marketplace} toastLanguage={this.props.language.toasts} updateLanguage={this.props.language.update}/>
        }
    }

  componentDidMount() {
    document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
    document.getElementById('center').classList.toggle('backgroundEffects');
    this.setState({ tab: this.tabs.settings, currentTab: 'settings' });
  }

  componentWillUnmount() {
    document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
    document.getElementById('center').classList.toggle('backgroundEffects');
  }

  changeEnabled(input) {
    document.getElementById(this.state.currentTab + 'TabLink').classList.toggle('active');
    document.getElementById(input + 'TabLink').classList.toggle('active');
    this.setState({ tab: this.tabs[input], currentTab: input });
  }

  render() {
    return (
      <div className='content'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1>{this.props.language.modals.title}</h1>
        <div className='tab'>
          <button className='tablinks' id='marketplaceTabLink' onClick={() => this.changeEnabled('marketplace')}><MarketplaceIcon/> {this.props.language.modals.marketplace}</button>
          <button className='tablinks' id='addonsTabLink'onClick={() => this.changeEnabled('addons')}><AddonsIcon/> {this.props.language.modals.addons}</button>
          <button className='tablinks active' id='settingsTabLink' onClick={() => this.changeEnabled('settings')}><SettingsIcon/> {this.props.language.modals.settings}</button>
        </div>
        <br/>
        {this.state.tab}
      </div>
    );
  }
}