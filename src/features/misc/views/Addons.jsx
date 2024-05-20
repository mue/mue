import variables from 'config/variables';
import { memo } from 'react';
import Tabs from 'components/Elements/MainModal/backend/Tabs';

import Added from '../../marketplace/views/Added';
import Create from '../../marketplace/views/Create';

function Addons(props) {
  return (
    <Tabs changeTab={(type) => props.changeTab(type)} current="addons">
      <div label={variables.getMessage('modals.main.addons.added')} name="added">
        <Added />
      </div>
      <div label={variables.getMessage('modals.main.addons.create.title')} name="create">
        <Create />
      </div>
    </Tabs>
  );
}

export default memo(Addons);
