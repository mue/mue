import variables from 'config/variables';
import { memo } from 'react';

import Added from '../../marketplace/views/Library';
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
      <div className="w-full rounded min-h-[69vh] bg-modal-content-light dark:bg-modal-content-dark p-10 flex flex-col">
        <Added />
      </div>
    )
  );
}

export default memo(Addons);
