import variables from 'config/variables';
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';

const Favourite = memo(({ tooltipText, credit, offline, pun }) => {
  const getInitialButton = () => {
    return localStorage.getItem('favourite') ? 'favourited' : 'unfavourited';
  };

  const [favourited, setFavourited] = useState(getInitialButton());
  const previousFavouritedRef = useRef(favourited);

  const favourite = useCallback(async () => {
    if (localStorage.getItem('favourite')) {
      localStorage.removeItem('favourite');
      setFavourited('unfavourited');
      tooltipText(variables.getMessage('widgets.quote.favourite'));
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
        default: {
          let url = document
            .getElementById('backgroundImage')
            .style.backgroundImage.replace('url("', '')
            .replace('")', '');

          if (!url) {
            return;
          }

          if (url.startsWith('blob:')) {
            const reader = new FileReader();
            url = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result);
              fetch(url)
                .then((res) => res.blob())
                .then((blob) => reader.readAsDataURL(blob));
            });
          }

          if (type === 'custom') {
            localStorage.setItem('favourite', JSON.stringify({ type, url }));
          } else {
            // photo information now hides information if it isn't sent, unless if photoinformation hover is hidden
            const location = document.getElementById('infoLocation');
            const camera = document.getElementById('infoCamera');

            localStorage.setItem(
              'favourite',
              JSON.stringify({
                type,
                url,
                credit: credit || '',
                location: location?.innerText,
                camera: camera?.innerText,
                resolution: document.getElementById('infoResolution').textContent || '',
                offline,
                pun,
              }),
            );
          }
          break;
        }
      }

      setFavourited('favourited');
      tooltipText(variables.getMessage('widgets.quote.unfavourite'));
      variables.stats.postEvent('feature', 'Background unfavourite');
    }
  }, [tooltipText, credit, offline, pun]);

  const updateTooltip = useCallback(() => {
    if (tooltipText) {
      tooltipText(
        localStorage.getItem('favourite')
          ? variables.getMessage('widgets.quote.unfavourite')
          : variables.getMessage('widgets.quote.favourite'),
      );
    }
  }, [tooltipText]);

  // componentDidMount
  useEffect(() => {
    updateTooltip();
  }, [updateTooltip]);

  // componentDidUpdate - only when favourited changes
  useEffect(() => {
    if (previousFavouritedRef.current !== favourited) {
      updateTooltip();
      previousFavouritedRef.current = favourited;
    }
  }, [favourited, updateTooltip]);

  if (localStorage.getItem('backgroundType') === 'colour') {
    return null;
  }

  const buttons = {
    favourited: <MdStar onClick={favourite} className="topicons" />,
    unfavourited: <MdStarBorder onClick={favourite} className="topicons" />,
  };

  return buttons[favourited];
});

Favourite.displayName = 'Favourite';

export default Favourite;
