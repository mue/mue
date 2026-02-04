import { useT } from 'contexts';
import { memo } from 'react';
import Tabs from 'components/Elements/MainModal/backend/Tabs';

import Added from '../../marketplace/views/Added';

function Library(props) {
  const t = useT();
  return (
    <Tabs
      changeTab={(type) => props.changeTab(type)}
      current="library"
      currentTab={props.currentTab}
      onSectionChange={props.onSectionChange}
    >
      <div label={t('modals.main.addons.added')} name="added">
        <Added />
      </div>
      <div label={t('modals.main.addons.create.title')} name="create"></div>
    </Tabs>
  );
}

export default memo(Library);
