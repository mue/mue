import variables from 'modules/variables';
import Tabs from './backend/Tabs';

import Added from '../marketplace/sections/Added';
import Sideload from '../marketplace/sections/Sideload';
import Create from '../marketplace/sections/Create';

export default function Addons(props) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <Tabs changeTab={(type) => props.changeTab(type)} current="addons">
      <div label={getMessage('modals.main.addons.added')} name="added">
        <Added />
      </div>
      <div label={getMessage('modals.main.addons.sideload.title')} name="sideload">
        <Sideload />
      </div>
      <div label={getMessage('modals.main.addons.create.title')} name="create">
        <Create />
      </div>
    </Tabs>
  );
}
