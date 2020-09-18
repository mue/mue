import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

export default class Search extends React.PureComponent {
  render() {
    if (localStorage.getItem('searchBar') === 'false') return null;

    let url;
    let query = 'q';

    switch (localStorage.getItem('searchEngine')) {
      case 'duckduckgo': url = 'https://duckduckgo.com'; break;
      case 'google': url = 'https://google.com/search'; break;
      case 'bing': url = 'https://bing.com/search'; break;
      case 'yahoo': url ='https://search.yahoo.com/search'; break;
      case 'ecosia': url = 'https://ecosia.org/search'; break;
      case 'yandex': url = 'https://yandex.ru/search'; query = 'text'; break;
      case 'qwant': url = 'https://www.qwant.com/'; break;
      case 'ask': url = 'https://ask.com/web'; break;
      case 'startpage': url = 'https://www.startpage.com/sp/search'; break;
      default: url = 'https://duckduckgo.com'; break;
    }

    const custom = localStorage.getItem('customSearchEngine');
    if (custom) url = custom;

    const searchButton = () => {
      let value = document.getElementById('searchtext').value;
      if (!value) value = 'mue fast';
      window.location.href = url + `?${query}=` + value;
    };

    return (
      <div id='searchBar' className='searchbar'>
        <form id='searchBar' className='searchbarform' action={url}>
            <SearchIcon onClick={() => searchButton()} />
            <input type='text' placeholder={this.props.language} name={query} id='searchtext' className='searchtext'/>
            <div className='blursearcbBG'/>
          </form>
      </div>
    );
  }
}