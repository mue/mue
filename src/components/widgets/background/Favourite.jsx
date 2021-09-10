import variables from 'modules/variables';
import { PureComponent } from 'react';
import { Star, StarBorder } from '@mui/icons-material';
import Hotkeys from 'react-hot-keys';

import Tooltip from 'components/helpers/tooltip/Tooltip';

export default class Favourite extends PureComponent {
  buttons = {
    favourited: <Star onClick={() => this.favourite()} className='topicons' />,
    unfavourited: <StarBorder onClick={() => this.favourite()} className='topicons' />
  }

  constructor() {
    super();
    this.state = {
      favourited: (localStorage.getItem('favourite')) ? this.buttons.favourited : this.buttons.unfavourited
    };
  }

  favourite() {
    if (localStorage.getItem('favourite')) {
      localStorage.removeItem('favourite');
      this.setState({
        favourited: this.buttons.unfavourited
      });
      window.stats.postEvent('feature', 'Background favourite');
    } else {
      const url = document.getElementById('backgroundImage').style.backgroundImage.replace('url("', '').replace('")', '');

      if (!url) {
        return;
      }

      // photo information now hides information if it isn't sent, unless if photoinformation hover is hidden
      const location = document.getElementById('infoLocation');
      const camera = document.getElementById('infoCamera');

      localStorage.setItem('favourite', JSON.stringify({ 
        url: url, 
        credit: document.getElementById('credit').textContent,
        location: location ? location.innerText : 'N/A',
        camera: camera ? camera.innerText : 'N/A',
        resolution: document.getElementById('infoResolution').textContent
      }));

      this.setState({
        favourited: this.buttons.favourited
      });
      window.stats.postEvent('feature', 'Background unfavourite');
    }
  }

  render() {
    const backgroundType = localStorage.getItem('backgroundType');
    if (backgroundType === 'colour' || backgroundType === 'custom') {
      return null;
    }

    return (
      <Tooltip title={variables.language.getMessage(variables.languagecode, 'modals.main.settings.sections.background.buttons.favourite')}>
        {this.state.favourited}
        {window.keybinds.favouriteBackground && window.keybinds.favouriteBackground !== '' ? <Hotkeys keyName={window.keybinds.favouriteBackground} onKeyDown={() => this.favourite()} /> : null}
      </Tooltip>
    );
  }
}
