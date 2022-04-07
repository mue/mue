import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdCropFree } from 'react-icons/md';
//import Hotkeys from 'react-hot-keys';

import Tooltip from 'components/helpers/tooltip/Tooltip';

export default class Maximise extends PureComponent {
  constructor() {
    super();
    this.state = {
      hidden: false
    };
  }

  setAttribute(blur, brightness, filter) {
    // don't attempt to modify the background if it isn't an image
    const backgroundType = localStorage.getItem('backgroundType');
    if (backgroundType === 'colour' || backgroundType === 'random_colour' || backgroundType === 'random_gradient') {
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
      variables.stats.postEvent('feature', 'Background maximise');
    } else {
      this.setState({
        hidden: false
      });

      this.setAttribute(localStorage.getItem('blur'), localStorage.getItem('brightness'), true);
      variables.stats.postEvent('feature', 'Background unmaximise');
    }
  }

  render() {
    return (
      <Tooltip title={variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.background.buttons.view')}>
        <MdCropFree onClick={this.maximise} className='topicons' />
        {/*variables.keybinds.maximiseBackground && variables.keybinds.maximiseBackground !== '' ? <Hotkeys keyName={variables.keybinds.maximiseBackground} onKeyDown={this.maximise} /> : null*/}
      </Tooltip>
    );
  }
}
