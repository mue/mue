import React from 'react';

import Settings from './tabs/Settings';
import Addons from './tabs/Addons';
import Marketplace from './tabs/Marketplace';

import Tabs from './tabs/backend/Tabs';

import './scss/index.scss';

export default function MainModal(props) {
  const language = window.language.modals.main.navbar;

  return (
    <>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <Tabs navbar={true}>
        <div label={language.settings}><Settings/></div>
        <div label={language.addons}><Addons/></div>
        <div label={language.marketplace}><Marketplace/></div>
      </Tabs>
    </>
  );
}
