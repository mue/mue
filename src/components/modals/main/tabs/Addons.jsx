import React from 'react';

import Added from '../marketplace/sections/Added';
import Sideload from '../marketplace/sections/Sideload';

import Tabs from './backend/Tabs';

export default function Addons() {
  const addons = window.language.modals.main.addons;

  return (
    <Tabs>
      <div label={addons.added}><Added/></div>
      <div label={addons.sideload}><Sideload/></div>
    </Tabs>
  );
}
