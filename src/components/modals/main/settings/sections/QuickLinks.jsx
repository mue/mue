import React from 'react';

import Switch from '../Switch';
import Checkbox from '../Checkbox';

export default function QuickLinks() {
  const language = window.language.modals.main.settings.sections.quicklinks;

  return (
    <>
      <h2>{language.title}</h2>
      <Switch name='quicklinksenabled' text={window.language.modals.main.settings.enabled} />
      <Checkbox name='quicklinksnewtab' text='Open in new tab' />
      <Checkbox name='quicklinkstooltip' text='Tooltip' />
      <Checkbox name='quicklinksnewtab' text='Chrome Apps' />
    </>
  );
}
