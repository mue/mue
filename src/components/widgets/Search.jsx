import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
const searchEngines = require('../../modules/searchEngines.json');

export default class Search extends React.PureComponent {
  render() {
    if (localStorage.getItem('searchBar') === 'false') return null;

    let url;
    let query = 'q';

    const setting = localStorage.getItem('searchEngine');
    const info = searchEngines.find(i => i.settingsName === setting);
    if (info !== undefined) {
      url = info.url;
      if (info.query) query = info.query;
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