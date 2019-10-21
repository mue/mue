//* Imports
import React from 'react';

// TODO: Add option to change search engine
export default class Search extends React.Component {
  render() {
    return (
      <div id='searchBar' className='searchbar'>
        <form id='searchBar' className='searchbarform' action='https://duckduckgo.com/' onSubmit={('search();')}> 
            <input type='text' placeholder='Search' name='q' id='searchtext' className='searchtext'/>
            <div className='blursearcbBG'/>
          </form>
      </div>
    );
  }
}