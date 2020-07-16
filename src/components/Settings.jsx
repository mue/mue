import React from 'react';

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

  render() {
    return <div className="content">
      <a class="closeModal" onClick={this.props.modalClose}>&times;</a>
      <h1>Settings</h1>
      <p>Edit different components to make Mue your new tab.</p>

      <div className='columns'>
        <div className='section'>
          <h4>Time</h4>
          <label class="switch">
            <input type="checkbox" onClick={()=> this.setItem('time')} />
            <span class="slider round"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Greeting</h4>
          <label class="switch">
            <input type="checkbox" onClick={()=> this.setItem('greeting')} />
            <span class="slider round"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Quote</h4>
          <label class="switch">
            <input type="checkbox" onClick={()=> this.setItem('quote')} />
            <span class="slider"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Background</h4>
          <label class="switch">
            <input type="checkbox" onClick={()=> this.setItem('background')}  />
            <span class="slider"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Search Bar</h4>
          <label class="switch">
            <input type="checkbox" onClick={()=> this.setItem('searchBar')}  />
            <span class="slider"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Offline Mode</h4>
          <label class="switch">
            <input type="checkbox" onClick={()=> this.setItem('offlineMode')}  />
            <span class="slider"></span>
          </label>
        </div>
        <div className='section'>
          <h4>Enable WebP (experimental)</h4>
          <label class="switch">
            <input type="checkbox" onClick={()=> this.setItem('webp')}  />
            <span class="slider"></span>
          </label>
        </div>
        <button class="apply" onClick={() => window.location.reload()}>Apply</button>
      {/*
        <h4 style={{ flex: 2 }}>Time <span id="timeStatus">{localStorage.getItem('time') === 'true' ? 'ON' : 'OFF'}</span>
        </h4> 
        <button onClick={()=>this.setItem('time')}>Toggle Time</button>
      <h4 style={{ flex: 2 }}>Search Bar</h4>
      <button onClick={()=>this.setItem('searchbar')}>Toggle Searchbar</button>
      <h4 style={{ flex: 2 }}>Greeting <span id="greetingStatus">{localStorage.getItem('greeting') === 'true' ? 'ON' :
        'OFF'}</span></h4>
      <button onClick={()=>this.setItem('greeting')}>Greeting Toggle</button>
      <h4 style={{ flex: 2 }}>Quote <span id="quoteStatus">{localStorage.getItem('quote') === 'true' ? 'ON' :
          'OFF'}</span>     <button onClick={()=>this.setItem('quote')}>Quote Toggle</button>
          </h4>
      <h4 style={{ flex: 2 }}>Background <span id="backgroundStatus">{localStorage.getItem('background') === 'true' ? 'ON'
          : 'OFF'}</span></h4>
      <button onClick={()=> this.setItem('background')}>Background Toggle</button>

      <label class="switch">
        <input type="checkbox" />
        <span class="slider round"></span>
      </label>

      <label class="switch">
        <input type="checkbox"  checked />
        <span class="slider round"></span>
      </label>
      {/* <label className="switch">
        <input type="checkbox" checked></input>
          <span className="slider round"></span>
        </label> */} 

      </div>
    </div>;
  }
}