//* Imports
import React from 'react';

export default class Search extends React.Component {
  render() {
    const enabled = localStorage.getItem('searchBar');
    if (enabled === 'false') return (<div></div>);

    const searchEngine = localStorage.getItem('searchEngine');
    let url;

    switch (searchEngine) {
      case 'duckduckgo': url = 'https://duckduckgo.com'; break;
      case 'google': url = 'https://google.com/search'; break;
      case 'bing': url = 'https://bing.com/search'; break;
      default: url = 'https://duckduckgo.com'; break;
    }

    return (
      <div id='searchBar' className='searchbar'>
        <form id='searchBar' className='searchbarform' action={url}>
            <input type='text' placeholder='Search' name='q' id='searchtext' className='searchtext'/>
            <div className='blursearcbBG'/>
          </form>
      </div>
    );
  }
}