import React from 'react';

import Tooltip from '../../helpers/tooltip/Tooltip';

import FullscreenIcon from '@material-ui/icons/Fullscreen';

export default class Maximise extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      hidden: false
    };
  }

  setAttribute(blur, brightness, filter) {
    // don't attempt to modify the background if it isn't an image
    const backgroundType = localStorage.getItem('backgroundType');
    if (backgroundType === 'colour') {
      return;
    }

    const element = document.getElementById('backgroundImage');

    let backgroundFilter;
    if (filter === true) {
      backgroundFilter = localStorage.getItem('backgroundFilter');
    }

    element.setAttribute(
      'style',
      `background-image: url(${element.style.backgroundImage.replace('url("', '').replace('")', '')}); -webkit-filter: blur(${blur}px) brightness(${brightness}%) ${backgroundFilter ? backgroundFilter + '(' + localStorage.getItem('backgroundFilterAmount') + '%)' : ''};`
    );
  }

  maximise = () => {
    // hide widgets
    const widgets = document.getElementById('widgets');
    (this.state.hidden === false) ? widgets.style.display = 'none' : widgets.style.display = 'block';

    if (this.state.hidden === false) {
      this.setState({
        hidden: true
      });

      this.setAttribute(0, 100);
      window.stats.postEvent('feature', 'Background maximise');
    } else {
      this.setState({
        hidden: false
      });

      this.setAttribute(localStorage.getItem('blur'), localStorage.getItem('brightness'), true);
      window.stats.postEvent('feature', 'Background unmaximise');
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
