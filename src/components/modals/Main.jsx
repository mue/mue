import React from 'react';

import Settings from './tabs/Settings';
import Addons from './tabs/Addons';
import Marketplace from './tabs/Marketplace';

import Navigation from './tabs/backend/Tabs';

export default function MainModal(props) {
  return (
    <div className='modal'>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <h1>.</h1>
      <div>
        <Navigation navbar={true}>
          <div label={props.language.modals.main.navbar.settings}>
            <Settings language={props.language.modals.main.settings} toastLanguage={props.language.toasts} />
          </div>
          <div label={props.language.modals.main.navbar.addons}>
            <Addons/>
          </div>
          <div label={props.language.modals.main.navbar.marketplace}>
            <Marketplace/>
          </div>
        </Navigation>
      </div>
    </div>
  );
}