import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import MicIcon from '@material-ui/icons/Mic';

const searchEngines = require('../../modules/searchEngines.json');

export default class Search extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      url: '',
      query: ''
    };
  }

  startSpeechRecognition() {
    if (localStorage.getItem('voiceSearch') === 'false') return;
    const voiceSearch = new window.webkitSpeechRecognition();
    voiceSearch.start();
    voiceSearch.onresult = (event) => document.getElementById('searchtext').value = event.results[0][0].transcript;
    voiceSearch.onend = () => setTimeout(() => window.location.href = this.state.url + `?${this.state.query}=` + document.getElementById('searchtext').value, 1000);
  }

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
      const value = document.getElementById('searchtext').value || 'mue fast';
      window.location.href = url + `?${query}=` + value;
    };

    let microphone = null;
    if (localStorage.getItem('voiceSearch') === 'true') {
      this.setState({
        url: url,
        query: query
      });
      microphone = <MicIcon className='micIcon' onClick={() => this.startSpeechRecognition()}/>;
    }

    return (
      <div id='searchBar' className='searchbar'>
        <form id='searchBar' className='searchbarform' action={url}>
        {microphone}
            <SearchIcon onClick={() => searchButton()} id='searchButton' />
            <input type='text' placeholder={this.props.language} name={query} id='searchtext' className='searchtext'/>
            <div className='blursearcbBG'/>
          </form>
      </div>
    );
  }
}