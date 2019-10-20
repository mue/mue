import React from 'react';

export default class Search extends React.Component {
  render() {
    return (
      <div id='searchBar' className='search-bar'>
        <form id='searchBar' className='searchbarform' action='https://duckduckgo.com/' onSubmit={('search();')}>
            <input type='text' placeholder='Search' name='q' id='searchText' className='searchText'/>
            <div className='blursearcbBG'/>
          </form>
      </div>
    );
  }
}