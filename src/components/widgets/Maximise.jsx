import React from 'react';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

export default class View extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            hidden: false
        };
    }

    setAttribute(blur, brightness) {
        document.querySelector('#backgroundImage').setAttribute(
            'style',
            `background-image: url(${document.getElementById('backgroundImage').style.backgroundImage.replace('url("', '').replace('")', '')});
            -webkit-filter: blur(${blur});
            -webkit-filter: brightness(${brightness}%);`
        );
    }

  viewStuff() {
    const elements = ['#searchBar', '.navbar-container', '.clock', '.greeting', '.quotediv', 'time'];
    elements.forEach((element) => {
        try {
            (this.state.hidden === false) ?  document.querySelector(element).style.display = 'none' : document.querySelector(element).style.display = 'block';
        } catch (e) {
            return;
        }
    });
    if (this.state.hidden === false) {
        this.setState({ hidden: true });
        this.setAttribute(0, 100);
    } else {
        this.setState({ hidden: false });
        this.setAttribute(localStorage.getItem('blur'), localStorage.getItem('brightness'));
    }
  }

  render() {
    if (localStorage.getItem('view') === 'false') return null;
    return <div className='view'>
        <FullscreenIcon id='viewButton' onClick={() => this.viewStuff()} />
    </div>
  }
}