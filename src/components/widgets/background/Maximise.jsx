import React from 'react';

import Tooltip from '../../helpers/tooltip/Tooltip';

import FullscreenIcon from '@material-ui/icons/Fullscreen';

export default class View extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      hidden: false
    };
  }

  setAttribute(blur, brightness) {
    document.querySelector('#backgroundImage').setAttribute(
      'style',
      `background-image: url(${document.getElementById('backgroundImage').style.backgroundImage.replace('url("', '').replace('")', '')}); -webkit-filter: blur(${blur}px) brightness(${brightness}%);`
    );
  }

  maximise = () => {
    // elements to hide
    const elements = ['.searchBar', '.clock', '.greeting', '.quotediv', 'time', '.quicklinks-container', '.weather', '.date'];

    elements.forEach((element) => {
      try {
        (this.state.hidden === false) ? document.querySelector(element).style.display = 'none' : document.querySelector(element).style.display = 'block';
      } catch (e) {
        return;
      }
    });

    if (this.state.hidden === false) {
      this.setState({
        hidden: true
      });

      this.setAttribute(0, 100);
    } else {
      this.setState({
        hidden: false
      });

      this.setAttribute(localStorage.getItem('blur'), localStorage.getItem('brightness'));
    }
  }

  render() {
    return (
      <Tooltip title={window.language.modals.main.settings.sections.background.buttons.view}>
        <FullscreenIcon onClick={this.maximise} className='topicons' />
      </Tooltip>
    );
  }
}
