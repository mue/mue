import variables from 'modules/variables';
import Tabs from './backend/Tabs';

import Added from '../marketplace/sections/Added';
import Sideload from '../marketplace/sections/Sideload';
import Create from '../marketplace/sections/Create';

export default function Addons() {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;

  return (
    <Tabs>
      <div label={getMessage(languagecode, 'modals.main.addons.added')} name='added'><Added/></div>
      <div label={getMessage(languagecode, 'modals.main.addons.sideload')} name='sideload'><Sideload/></div>
      <div label={getMessage(languagecode, 'modals.main.addons.create.title')} name='create'><Create/></div>
    </Tabs>
  );
}
