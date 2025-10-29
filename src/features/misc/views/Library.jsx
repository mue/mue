import variables from 'config/variables';
import { memo } from 'react';
import Tabs from 'components/Elements/MainModal/backend/Tabs';

import Added from '../../marketplace/views/Added';
import Create from '../../marketplace/views/Create';

function Library(props) {
  return (
    <Tabs changeTab={(type) => props.changeTab(type)} current="library" currentTab={props.currentTab}>
      <div label={variables.getMessage('modals.main.addons.added')} name="added">
        <Added />
      </div>
      <div label={variables.getMessage('modals.main.addons.create.title')} name="create">
        <Create />
      </div>
    </Tabs>
  );
}

export default memo(Library);
