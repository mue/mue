import React from 'react';

export default class Search extends React.PureComponent {
  render() {
    if (localStorage.getItem('searchBar') === 'false') return <div></div>;

    let url;

    switch (localStorage.getItem('searchEngine')) {
      case 'duckduckgo': url = 'https://duckduckgo.com'; break;
      case 'google': url = 'https://google.com/search'; break;
      case 'bing': url = 'https://bing.com/search'; break;
      default: url = 'https://duckduckgo.com'; break;
    }

    return <div id='searchBar' className='searchbar'>
        <form id='searchBar' className='searchbarform' action={url}>
            <input type='text' placeholder={this.props.language} name='q' id='searchtext' className='searchtext'/>
            <div className='blursearcbBG'/>
          </form>
      </div>
  }
}