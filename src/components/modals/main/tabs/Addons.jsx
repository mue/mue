import variables from 'modules/variables';
import { memo } from 'react';
import PropTypes from 'prop-types';
import Tabs from './backend/Tabs';

import Added from '../marketplace/sections/Added';
import Create from '../marketplace/sections/Create';

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

Addons.propTypes = {
  changeTab: PropTypes.func.isRequired,
};

export default memo(Addons);
