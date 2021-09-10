import variables from 'modules/variables';
import { Suspense, lazy } from 'react';

import Tabs from './tabs/backend/Tabs';

import './scss/index.scss';

// Lazy load all the tabs instead of the modal itself
const Settings = lazy(() => import('./tabs/Settings'));
const Addons = lazy(() => import('./tabs/Addons'));
const Marketplace = lazy(() => import('./tabs/Marketplace'));

const renderLoader = () => (
  <Tabs>
    <div label={variables.language.getMessage(variables.languagecode, 'modals.main.loading')}>
      <div className='emptyitems'>
        <div className='emptyMessage'>
          <h1>{variables.language.getMessage(variables.languagecode, 'modals.main.loading')}</h1>
        </div>
      </div>
    </div>
    <div label='' style={{ display: 'none' }}></div>
  </Tabs>
);

export default function MainModal({ modalClose }) {
  const display = (localStorage.getItem('showReminder') === 'true') ? 'block' : 'none';

  return (
    <>
      <span className='closeModal' onClick={modalClose}>&times;</span>
      <Tabs navbar={true}>
        <div label={variables.language.getMessage(variables.languagecode, 'modals.main.navbar.settings')} name='settings'>
          <Suspense fallback={renderLoader()}>
            <Settings/>
          </Suspense>
        </div>
        <div label={variables.language.getMessage(variables.languagecode, 'modals.main.navbar.addons')} name='addons'>
          <Suspense fallback={renderLoader()}>
            <Addons/>
          </Suspense>
        </div>
        <div label={variables.language.getMessage(variables.languagecode, 'modals.main.navbar.marketplace')} name='marketplace'>
          <Suspense fallback={renderLoader()}>
            <Marketplace/>
          </Suspense>
        </div>
      </Tabs>
      <div className='reminder-info' style={{ display }}>
        <h1>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.reminder.title')}</h1>
        <p>{variables.language.getMessage(variables.languagecode, 'modals.main.settings.reminder.message')}</p>
        <button className='pinNote' onClick={() => window.location.reload()}>{variables.language.getMessage(variables.languagecode, 'modals.main.error_boundary.refresh')}</button>
      </div>
    </>
  );
}
