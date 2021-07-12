import React from 'react';

import Tooltip from '../../helpers/tooltip/Tooltip';

import StarIcon from '@material-ui/icons/Star';
import StarIcon2 from '@material-ui/icons/StarBorder';

export default class Favourite extends React.PureComponent {
  buttons = {
    favourited: <StarIcon onClick={this.favourite} className='topicons' />,
    unfavourited: <StarIcon2 onClick={this.favourite} className='topicons' />
  }

  constructor() {
    super();
    this.state = {
      favourited: (localStorage.getItem('favourite')) ? this.buttons.favourited : this.buttons.unfavourited
    };
  }

  favourite = () => {
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
      
      localStorage.setItem('favourite', JSON.stringify({ 
        url: url, 
        credit: document.getElementById('credit').textContent,
        location: document.getElementById('infoLocation').textContent,
        camera: document.getElementById('infoCamera').textContent,
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

    return <Tooltip title={window.language.modals.main.settings.sections.background.buttons.favourite}>{this.state.favourited}</Tooltip>;
  }
}
