import React from 'react';

import Added from '../marketplace/sections/Added';

import AddonsTabs from './backend/Tabs';

export default function Addons() {
  const language = window.language.modals.main.addons;

  return (
    <AddonsTabs>
      <div label={language.added}><Added/></div>
      <div label={language.sideload}></div>
    </AddonsTabs>
  );
}
