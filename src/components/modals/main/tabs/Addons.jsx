import React from 'react';

import Added from '../marketplace/sections/Added';

import Tabs from './backend/Tabs';

export default function Addons() {
  const addons = window.language.modals.main.addons;

  return (
    <Tabs>
      <div label={addons.added}><Added/></div>
      <div label={addons.sideload}></div>
    </Tabs>
  );
}
