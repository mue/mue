import React from 'react';

import Checkbox from '../Checkbox';
//import Text from '../Text';

export default function ExperimentalSettings() {
  const { experimental } = window.language.modals.main.settings.sections;

  return (
    <>
      <h2>{experimental.title}</h2>
      <p>{experimental.warning}</p>
      <Checkbox name='animations' text={window.language.modals.main.settings.sections.appearance.animations}/>
      <h3>{experimental.developer}</h3>
      <Checkbox name='debug' text='Debug hotkey (Ctrl + #)'/>
      {/* <Checkbox name='beta' text='Beta Mode Override'/>
      <Text name='api_override' title='Version Override (format example: 5.0)'/>
      <Text name='api_override' title='API URL Override'/>
      <Text name='marketplace_override' title='Marketplace URL Override'/>
      <Text name='unsplash_override' title='Unsplash URL Override'/>
      <Text name='sponsors_override' title='Sponsors URL Override'/>
      <Text name='github_override' title='GitHub URL Override'/> 
      <br/><br/>
      */}
      <button className='reset' style={{'marginLeft': '0px'}} onClick={() => localStorage.clear()}>Clear LocalStorage</button>
    </>
  );
}
