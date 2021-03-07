import React from 'react';

import Added from '../marketplace/sections/Added';

import AddonsTabs from './backend/Tabs';

export default function Addons (props) {
    return (
      <React.Fragment>
        <AddonsTabs>
          <div label='Added'>
            <Added/>
          </div>
          <div label=''>
              
          </div>
        </AddonsTabs>
      </React.Fragment>
    );
}