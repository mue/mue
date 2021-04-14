import React from 'react';

import Tabs from './tabs/backend/Tabs';

import './scss/index.scss';

const Settings = React.lazy(() => import('./tabs/Settings'));
const Addons = React.lazy(() => import('./tabs/Addons'));
const Marketplace = React.lazy(() => import('./tabs/Marketplace'));

const renderLoader = () => (<Tabs>
  <div label=''>{window.language.modals.main.loading}</div>
  <div label=''>{window.language.modals.main.loading}</div>
</Tabs>);

export default function MainModal(props) {
  const language = window.language.modals.main.navbar;

  return (
    <>
      <span className='closeModal' onClick={props.modalClose}>&times;</span>
      <Tabs navbar={true}>
        <div label={language.settings}>
          <React.Suspense fallback={renderLoader()}>
            <Settings/>
          </React.Suspense>
        </div>
        <div label={language.addons}>
          <React.Suspense fallback={renderLoader()}>
            <Addons/>
          </React.Suspense>
        </div>
        <div label={language.marketplace}>
          <React.Suspense fallback={renderLoader()}>
            <Marketplace/>
          </React.Suspense>
        </div>
      </Tabs>
    </>
  );
}
