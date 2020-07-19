// eslint-disable
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
    // console.log(`[DEBUG] setItem(${key}, ${old} -> ${val})`);
  }

  toggleExtra(element, element2) {
    (element.style.display === 'none' || !element.style.display) ? element.style.display = 'block' : element.style.display = 'none';
    (element2.style.transform === 'rotate(-180deg)') ? element2.style.transform = 'rotate(0)' : element2.style.transform = 'rotate(-180deg)';
  }

  saveStuff() {
    localStorage.setItem('blur', document.getElementById('blurRange').value); // this is better than inline onChange for performance
    localStorage.setItem('greetingName', document.getElementById('greetingName').value);
    localStorage.setItem('customBackground', document.getElementById('customBackground').value);
    //if (!document.getElementById('customBackgroundColour').enabled === 'false') localStorage.setItem('customBackgroundColour', document.getElementById('customBackgroundColour').value);
    window.location.reload();
  }

  resetItem(key) {
    switch (key) {
      case 'greetingName': document.getElementById('greetingName').value = ''; break;
      case 'customBackgroundColour':
        localStorage.setItem('customBackgroundColour', '');
        document.getElementById('customBackgroundColour').enabled = 'false';
        break;
      case 'customBackground': document.getElementById('customBackground').value = ''; break;
      case 'blur':
        localStorage.setItem('blur', 0);
        document.getElementById('blurRange').value = 0;
        document.getElementById('blurAmount').innerText = '0';
        break;
      default: console.log('[ERROR] resetItem requires a key!');
    }
    this.showToast();
  }

  showToast() {
    let toast = document.getElementById('toast');
    toast.innerText = 'Reset successfully!';
    toast.className = 'show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
  }

  componentDidMount() {
    document.getElementById('greetingName').value = localStorage.getItem('greetingName');
    document.getElementById('customBackground').value = localStorage.getItem('customBackground');
    /*const hex = localStorage.getItem('customBackgroundColour');
    if (!hex === '') {
      document.getElementById('customBackgroundColour').value = hex;
      document.getElementById('customBackgroundHex').innerText = hex;
    }*/

    for (const key of Object.keys(localStorage)) {
      let value = localStorage.getItem(key);

      if (key === 'blur') {
        document.getElementById('blurAmount').innerText = value;
        document.getElementById('blurRange').value = value;
      }
  
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

    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) this.saveStuff();
    });
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
            <input name="1" type="checkbox" onClick={()=> this.setItem('seconds')} id='secondsStatus' />
            <label htmlFor="1">Seconds</label>
            </ul>
            <ul>
            <input name="2" type="checkbox" onClick={()=> this.setItem('24hour')} id='24hourStatus' />
            <label htmlFor="2">24 Hour</label>
            </ul>
          </li>
        </div>
        </div>
        <div style={{ "lineHeight": "1px" }} className='section'>
          <h4>Greeting</h4>       
          <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[1], document.getElementsByClassName('expandIcons')[1])} />
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('greeting')} id='greetingStatus' />
            <span className="slider round"></span>
          </label>
          <li className="extraSettings">
            <ul>
            <input name="3" type="checkbox" onClick={()=> this.setItem('events')} id='eventsStatus' />
            <label htmlFor="3">Events</label>
            </ul>
            <ul>
              <p>Name for greeting <span className="modalLink" onClick={() => this.resetItem('greetingName')}>Reset</span></p>
              <input type='text' id='greetingName'></input>
            </ul>
          </li>
        </div>
        <div className='section'>
          <h4>Quote</h4>
          <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[2], document.getElementsByClassName('expandIcons')[2])} />
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('quote')} id='quoteStatus' />
            <span className="slider"></span>
          </label>
          <li className="extraSettings">
            <ul>
            <input name="5" type="checkbox" onClick={()=> this.setItem('copyButton')} id='copyButtonStatus' />
            <label htmlFor="5">Copy Button</label>
            </ul>
          </li>
        </div>
        <div className='section'>
          <h4>Background</h4>
          <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[3], document.getElementsByClassName('expandIcons')[3])} />
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('background')} id='backgroundStatus'  />
            <span className="slider"></span>
          </label>
          <li className="extraSettings">
            <ul>
              <p>Adjust Blur (<span id='blurAmount'></span>%) <span className="modalLink" onClick={() => this.resetItem('blur')}>Reset</span></p>
            </ul>
            <ul>
              <input className="range" type="range" min="0" max="100" id='blurRange' onInput={() => document.getElementById('blurAmount').innerText = document.getElementById('blurRange').value} />
            </ul>
            <ul>
              <p>Custom Background URL <span className="modalLink" onClick={() => this.resetItem('customBackground')}>Reset</span></p>
              <input type='text' id='customBackground'></input>
            </ul>
            { /*<ul>
              <p>Custom Background Colour <span className="modalLink" onClick={() => this.resetItem('customBackgroundColour')}>Reset</span></p>
              <input name='colour' type='color' id='customBackgroundColour' onChange={() => document.getElementById('customBackgroundHex').innerText = document.getElementById('customBackgroundColour').value}></input>
              <label for='colour' id='customBackgroundHex'>#00000</label>
            </ul>  */}
          </li>
        </div>
        <div className='section'>
          <h4>Search Bar</h4>
          {/* <ExpandMore className='expandIcons' onClick={() => this.toggleExtra(document.getElementsByClassName('extraSettings')[4], document.getElementsByClassName('expandIcons')[4])} /> */ }
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('searchBar')} id='searchBarStatus'  />
            <span className="slider"></span>
          </label>
          {/* <li className="extraSettings">
            <ul>
            <label htmlFor="4">Search Engine</label>
            <select name="4" id='searchBar'>
              <option value="duckduckgo">DuckDuckGo</option>
              <option value="google">Google</option>
              <option value="bing">Bing</option>
              <option value="custom">Custom</option>
            </select>
            </ul>
          </li> */}
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
        <div className='section'>
          <h4>Dark Theme (experimental)</h4>
          <label className="switch">
            <input type="checkbox" onClick={()=> this.setItem('darkTheme')} id='darkThemeStatus'  />
            <span className="slider"></span>
          </label>
        </div>
        <button className="apply" onClick={() => this.saveStuff()}>Apply</button>
        <button className="reset" onClick={() => this.props.setDefaultSettings()}>Reset</button>
      </div>
      
    </div>;
  }
}