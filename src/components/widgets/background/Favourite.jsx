import variables from 'modules/variables';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdStar, MdStarBorder } from 'react-icons/md';

class Favourite extends PureComponent {
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

  async favourite() {
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
          let url = document
            .getElementById('backgroundImage')
            .style.backgroundImage.replace('url("', '')
            .replace('")', '')
            .replace(variables.constants.DDG_IMAGE_PROXY, '');

          if (!url) {
            return;
          }

          if (url.startsWith('blob:')) {
            const reader = new FileReader();
            url = await new Promise(async (resolve) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(await (await fetch(url)).blob());
            });
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
                credit: this.props.credit || '',
                location: location?.innerText,
                camera: camera?.innerText,
                resolution: document.getElementById('infoResolution').textContent || '',
                offline: this.props.offline,
                pun: this.props.pun,
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
    if (localStorage.getItem('backgroundType') === 'colour') {
      return null;
    }

    return this.state.favourited;
  }
}

Favourite.propTypes = {
  credit: PropTypes.string,
  offline: PropTypes.bool,
  pun: PropTypes.string,
};

export default Favourite;
