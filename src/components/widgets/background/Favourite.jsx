import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
//import Hotkeys from 'react-hot-keys';

export default class Favourite extends PureComponent {
  buttons = {
    favourited: <MdStar onClick={() => this.favourite()} className="topicons" />,
    unfavourited: <MdStarBorder onClick={() => this.favourite()} className="topicons" />,
  };

  constructor() {
    super();
    this.state = {
      favourited: localStorage.getItem('favourite')
        ? this.buttons.favourited
        : this.buttons.unfavourited,
    };
  }

  favourite() {
    if (localStorage.getItem('favourite')) {
      localStorage.removeItem('favourite');
      this.setState({
        favourited: this.buttons.unfavourited,
      });
      variables.stats.postEvent('feature', 'Background favourite');
    } else {
      const type = localStorage.getItem('backgroundType');
      switch (type) {
        case 'colour':
          return;
        case 'random_colour':
        case 'random_gradient':
          localStorage.setItem(
            'favourite',
            JSON.stringify({
              type: localStorage.getItem('backgroundType'),
              url: document.getElementById('backgroundImage').style.background,
            }),
          );
          break;
        default:
          const url = document
            .getElementById('backgroundImage')
            .style.backgroundImage.replace('url("', '')
            .replace('")', '')
            .replace(variables.constants.DDG_IMAGE_PROXY, '');

          if (!url) {
            return;
          }

          if (type === 'custom') {
            localStorage.setItem(
              'favourite',
              JSON.stringify({
                type,
                url,
              }),
            );
          } else {
            // photo information now hides information if it isn't sent, unless if photoinformation hover is hidden
            const location = document.getElementById('infoLocation');
            const camera = document.getElementById('infoCamera');

            localStorage.setItem(
              'favourite',
              JSON.stringify({
                type,
                url,
                credit: document.getElementById('credit').textContent || '',
                location: location ? location.innerText : 'N/A',
                camera: camera ? camera.innerText : 'N/A',
                resolution: document.getElementById('infoResolution').textContent || '',
              }),
            );
          }
      }

      this.setState({
        favourited: this.buttons.favourited,
      });
      variables.stats.postEvent('feature', 'Background unfavourite');
    }
  }

  render() {
    const backgroundType = localStorage.getItem('backgroundType');
    if (backgroundType === 'colour') {
      return null;
    }

    return (
      <>
        {this.state.favourited}
        {/*variables.keybinds.favouriteBackground && variables.keybinds.favouriteBackground !== '' ? <Hotkeys keyName={variables.keybinds.favouriteBackground} onKeyDown={() => this.favourite()} /> : null*/}
      </>
    );
  }
}
