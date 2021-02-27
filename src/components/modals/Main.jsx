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
        <h1>{this.props.language.modals.title}</h1>
        <div>
          <Navigation navbar={true}>
            <div label='Settings'>
              <Settings language={this.props.language.settings} toastLanguage={this.props.language.toasts} />
            </div>
            <div label='My Add-ons'>
              <Addons/>
            </div>
            <div label='Marketplace'>
              <Marketplace/>
            </div>
          </Navigation>
        </div>
      </div>
    );
  }
}