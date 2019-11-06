//* Imports
import RefreshIcon from '@material-ui/icons/Refresh';
import LocalPizzaIcon from '@material-ui/icons/LocalPizza';
import React from 'react';

export default class Search extends React.Component {
  render() {
    return (
      <div className="navbar-container">
        <div className='navbar1'>
              <RefreshIcon className='locationicon' />
        </div>
        <div className='navbar2'>
            <LocalPizzaIcon className='pizzaicon'/>
        </div>
        </div>
    );
  }
}