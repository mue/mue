import variables from 'config/variables';
import { useState } from 'react';
import { MdCropFree } from 'react-icons/md';
import { Tooltip } from 'components/Elements';

import defaults from '../options/default';

function Maximise(props) {
  const [hidden, setHidden] = useState(false);

  const setAttribute = (blur, brightness, filter) => {
    // don't attempt to modify the background if it isn't an image
    const backgroundType = localStorage.getItem('backgroundType') || defaults.backgroundType;
    if (
      backgroundType === 'colour' ||
      backgroundType === 'random_colour' ||
      backgroundType === 'random_gradient'
    ) {
      return;
    }

    const element = document.getElementById('backgroundImage');

    let backgroundFilter;
    if (filter === true) {
      const filterData = localStorage.getItem('backgroundFilter') || defaults.backgroundFilter;
      if (filterData !== 'none') {
        backgroundFilter = filterData;
      }
    }

    element.setAttribute(
      'style',
      `background-image: url(${element.style.backgroundImage
        .replace('url("', '')
        .replace('")', '')}); -webkit-filter: blur(${blur}px) brightness(${brightness}%) ${
        backgroundFilter
          ? backgroundFilter + '(' + localStorage.getItem('backgroundFilterAmount') + '%)'
          : ''
      };`,
    );
  };

  const maximise = () => {
    // hide widgets
    const widgets = document.getElementById('widgets');
    setHidden(!hidden);
    widgets.style.display = hidden ? 'none' : 'flex';

    if (hidden === false) {
      setAttribute(0, 100);
      variables.stats.postEvent('feature', 'Background maximise');
    } else {
      setAttribute(
        localStorage.getItem('blur') || defaults.blur,
        localStorage.getItem('brightness') || defaults.brightness,
        true,
      );
      variables.stats.postEvent('feature', 'Background unmaximise');
    }
  };

  return (
    <Tooltip title={variables.getMessage('modals.main.settings.sections.background.buttons.view')}>
      <button
        className="navbarButton"
        style={{ fontSize: props.fontSize }}
        onClick={maximise}
        aria-label={variables.getMessage('modals.main.settings.sections.background.buttons.view')}
      >
        <MdCropFree className="topicons" />
      </button>
    </Tooltip>
  );
}

export { Maximise as default, Maximise };
