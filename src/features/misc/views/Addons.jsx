import variables from 'config/variables';
import { memo } from 'react';

import Added from '../../marketplace/views/Added';
import Create from '../../marketplace/views/Create';

function Addons(props) {
  return (
    {
      /*<Tabs changeTab={(type) => props.changeTab(type)} current="addons" modalClose={props.modalClose}>
      <div label={variables.getMessage('addons:added')} name="added">
      </div>
      <div label={variables.getMessage('addons:create.title')} name="create">
        <Create />
      </div>
    </Tabs>*/
    },
    (
      <div className="modalTabContent">
        <Added />
      </div>
    )
  );
}

export default memo(Addons);
