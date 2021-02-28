import React from 'react';

import Settings from './tabs/Settings';
import Addons from './tabs/Addons';
import Marketplace from './tabs/Marketplace';

import Navigation from './tabs/backend/Tabs';

export default class MainModal extends React.PureComponent {
  render() {
    return (
      <div className='modal'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1>Options</h1>
        <div>
          <Navigation navbar={true}>
            <div label={this.props.language.modals.main.navbar.settings}>
              <Settings language={this.props.language.modals.main.settings} toastLanguage={this.props.language.toasts} />
            </div>
            <div label={this.props.language.modals.main.navbar.addons}>
              <Addons/>
            </div>
            <div label={this.props.language.modals.main.navbar.marketplace}>
              <Marketplace/>
            </div>
          </Navigation>
        </div>
      </div>
    );
  }
}