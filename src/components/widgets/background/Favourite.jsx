import React from 'react';

import Tooltip from '../../helpers/tooltip/Tooltip';

import StarIcon from '@material-ui/icons/Star';
import StarIcon2 from '@material-ui/icons/StarBorder';

export default class Favourite extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      favourited: (localStorage.getItem('favourite')) ? <StarIcon onClick={this.favourite} className='topicons' /> : <StarIcon2 onClick={this.favourite}  className='topicons' />
    };
  }

  favourite = () => {
    if (localStorage.getItem('favourite')) {
      localStorage.removeItem('favourite');
      this.setState({
        favourited: <StarIcon2 onClick={this.favourite} className='topicons' />
      });
    } else {
      const url = document.getElementById('backgroundImage').style.backgroundImage.replace('url("', '').replace('")', '');
      const credit = document.getElementById('credit').textContent;

      localStorage.setItem('favourite', JSON.stringify({ url: url, credit: credit }));

      this.setState({
        favourited: <StarIcon onClick={this.favourite} className='topicons' />
      });
    }
  }

  render() {
    if (localStorage.getItem('backgroundType') === 'colour') {
      return null;
    }

    return <Tooltip title={window.language.modals.main.settings.sections.background.buttons.favourite}>{this.state.favourited}</Tooltip>;
  }
}
