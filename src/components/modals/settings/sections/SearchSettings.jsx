import React from 'react';
import SettingsFunctions from '../../../../modules/settingsFunctions';

export default class SearchSettings extends React.PureComponent {
  render() {
    return (
        <div>
             <ul>
            <label htmlFor='4'>{this.props.language.searchbar.searchengine} </label>
              <select className='select-css' name='4' id='searchEngine' onChange={() => SettingsFunctions.setSearchEngine(document.getElementById('searchEngine').value)}>
                <option className='choices' value='duckduckgo'>DuckDuckGo</option>
                <option className='choices' value='google'>Google</option>
                <option className='choices' value='bing'>Bing</option>
                <option className='choices' value='yahoo'>Yahoo</option>
                <option className='choices' value='ecosia'>Ecosia</option>
                <option className='choices' value='yandex'>Yandex</option>
                <option className='choices' value='qwant'>Qwant</option>
                <option className='choices' value='ask'>Ask</option>
                <option className='choices' value='startpage'>Startpage</option>
               {/* <option value='custom'>Custom</option> */}
              </select>
            </ul>
            <ul id='searchEngineInput' style={{ display: 'none' }}>
              <p style={{"marginTop": "0px"}}>Custom Search URL <span className='modalLink' onClick={() => this.props.resetItem('customSearchEngine')}>Reset</span></p>
              <input type='text' id='customSearchEngine'></input>
            </ul>
        </div>
    );
  }
}