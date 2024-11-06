import variables from 'config/variables';
import { useState, useEffect } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';

import defaults from '../options/default';

function Favourite({ credit, offline, pun, tooltipText }) {
  const [favourited, setFavourited] = useState(false);

  useEffect(() => {
    const isFavourited = localStorage.getItem('favourite') !== null;
    setFavourited(isFavourited);
    tooltipText(
      isFavourited
        ? variables.getMessage('widgets.quote.unfavourite')
        : variables.getMessage('widgets.quote.favourite'),
    );
  }, [tooltipText]);

  const favourite = async () => {
    if (localStorage.getItem('favourite')) {
      localStorage.removeItem('favourite');
      setFavourited(false);
      tooltipText(variables.getMessage('widgets.quote.favourite'));
      variables.stats.postEvent('feature', 'background', 'favourite');
    } else {
      const type = localStorage.getItem('backgroundType') || defaults.backgroundType;

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
            .replace('")', '');

          if (!url) {
            return;
          }

          if (url.startsWith('blob:')) {
            const reader = new FileReader();
            url = await new Promise(async (resolve) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(await (await fetch(url)).blob());
            });

            if (type === 'custom') {
              localStorage.setItem(
                'favourite',
                JSON.stringify({
                  type,
                  url,
                }),
              );
            } else {
              const location = document.getElementById('infoLocation');
              const camera = document.getElementById('infoCamera');

              localStorage.setItem(
                'favourite',
                JSON.stringify({
                  type,
                  url,
                  credit,
                  location: location?.innerText,
                  camera: camera?.innerText,
                  resolution: document.getElementById('infoResolution').textContent || '',
                  offline,
                  pun,
                }),
              );
            }
          }

          setFavourited(true);
          tooltipText(variables.getMessage('widgets.quote.unfavourite'));
          variables.stats.postEvent('feature', 'background', 'unfavourite');
          return;
      }

      setFavourited(true);
      tooltipText(variables.getMessage('widgets.quote.unfavourite'));
      variables.stats.postEvent('feature', 'background', 'unfavourite');
    }
  };

  if (localStorage.getItem('backgroundType') === 'colour') {
    return null;
  }

  return favourited ? (
    <MdStar onClick={favourite} className="topicons" />
  ) : (
    <MdStarBorder onClick={favourite} className="topicons" />
  );
}

export default Favourite;
