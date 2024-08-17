import variables from 'config/variables';
import { memo } from 'react';

import Library from '../../marketplace/views/Library';

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
      <div className="w-full rounded h-[calc(78vh-80px)] bg-modal-content-light dark:bg-modal-content-dark p-10 flex flex-col overflow-scroll">
        <Library />
      </div>
    )
  );
}

export default memo(Addons);
