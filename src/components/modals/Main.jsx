import React from 'react';

import Settings from './tabs/Settings';
import Addons from './tabs/Addons';
import Marketplace from './tabs/Marketplace';

import Navigation from './tabs/backend/Tabs';

export default function MainModal(props) {
  const language = window.language;

  return (
    <div className='modal'>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <div>
        <Navigation navbar={true}>
          <div label={language.modals.main.navbar.settings}>
            <Settings/>
          </div>
          <div label={language.modals.main.navbar.addons}>
            <Addons/>
          </div>
          <div label={language.modals.main.navbar.marketplace}>
            <Marketplace/>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
