import React from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';

export default class Settings extends React.Component {
  setItem(key, value) {
    let old = localStorage.getItem(key);
    let val = true;

    if (old !== null && !value) {
      if (old === 'true') val = false;
      if (old === 'false') val = true;
    }

    localStorage.setItem(key, val);
    //document.getElementById(`${key}Status`).innerHTML = val === true ? 'ON' : 'OFF';
    console.log(`[DEBUG] setItem(${key}, ${old} -> ${val})`);
  }

  toggleExtra(element, element2) {
    (element.style.display === 'none' || !element.style.display) ? element.style.display = 'block' : element.style.display = 'none';
    (element2.style.transform === 'rotate(-180deg)') ? element2.style.transform = 'rotate(0)' : element2.style.transform = 'rotate(-180deg)';
  }

  componentDidMount() {
    for (const key of Object.keys(localStorage)) {
      let value = localStorage.getItem(key);
      const tag = document.getElementById(`${key}Status`);
      
      if (tag) {
        switch (value) {
          case 'true': value = true; break;
          case 'false': value = false; break;
          default: value = true; 
        }

        tag.checked = value;
      }
    }
  }

  render() {
    return <div className="content">
      <span className="closeModal" onClick={this.props.modalClose}>&times;</span>
      <h1>Settings</h1>
      <p>Edit different components to make Mue your new tab.</p>
      <div className='columns'>
          <div className='group'>
          <div className='section'>
            <h4>Time</h4>     
            <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[0], document.getElementsByClassName('expandIcons')[0])} />
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('time')} id='timeStatus' />
            <span className="slider round"></span>
          </label>
          <li className="extraSettings">
            <ul>
            <input id="1" type="checkbox" onClick={()=> this.setItem('seconds')} id='secondsStatus' />
            <label for="1">Seconds</label>
            </ul>
            <ul>
            <input id="2" type="checkbox" onClick={()=> this.setItem('24hour')} id='24hourStatus' />
            <label for="2">24 Hour</label>
            </ul>
          </li>
        </div>
        </div>
        <div className='section'>
          <h4>Greeting</h4>
          <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[1], document.getElementsByClassName('expandIcons')[1])} />
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('greeting')} id='greetingStatus' />
            <span className="slider round"></span>
          </label>
          <li className="extraSettings">
            <ul>
            <input id="3" type="checkbox" onClick={()=> this.setItem('events')} id='eventsStatus' />
            <label for="3">Events</label>
            </ul>
          </li>
        </div>
        <div className='section'>
          <h4>Quote</h4>
          <label className="switch">
            <input id="quoteStatus" type="checkbox" onClick={()=> this.setItem('quote')} id='quoteStatus' />
            <span className="slider"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Background</h4>
          <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[2], document.getElementsByClassName('expandIcons')[2])} />
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('background')} id='backgroundStatus'  />
            <span className="slider"></span>
          </label>
          <li className="extraSettings">
            <ul>
              <p>Adjust Blur</p>
            </ul>
            <ul>
              <input className="range" type="range" min="1" max="100" />
            </ul>
            <ul>
              <p>Adjust Brightness</p>
            </ul>
            <ul>
              <input className="range" type="range" min="1" max="100" />
            </ul>
          </li>
        </div>
        <div className='section'>
          <h4>Search Bar</h4>
          <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[3], document.getElementsByClassName('expandIcons')[3])} />
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('searchBar')} id='searchBarStatus'  />
            <span className="slider"></span>
          </label>
          <li className="extraSettings">
            <ul>
            <label for="4">Search Engine</label>
            <select name="4">
              <option value="duckduckgo">DuckDuckGo</option>
              <option value="google">Google</option>
              <option value="bing">Bing</option>
              <option value="custom">Custom</option>
            </select>
            </ul>
          </li>
        </div>
        <div className='section'>
          <h4>Offline Mode</h4>
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('offlineMode')} id='offlineModeStatus'  />
            <span className="slider"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Enable WebP (experimental)</h4>
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('webp')} id='webpStatus'  />
            <span className="slider"></span>
          </label>
        </div>
        <button className="apply" onClick={() => window.location.reload()}>Apply</button>
      </div>
    </div>;
  }
}