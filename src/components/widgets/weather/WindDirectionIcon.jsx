import { memo } from 'react';
import PropTypes from 'prop-types';

import {
  WiDirectionDownLeft,
  WiDirectionDownRight,
  WiDirectionDown,
  WiDirectionLeft,
  WiDirectionRight,
  WiDirectionUpLeft,
  WiDirectionUpRight,
  WiDirectionUp,
} from 'react-icons/wi';

// degrees are imported because of a potential bug, IDK what causes it, but now it is fixed
function WindDirectionIcon({ degrees }) {
  // convert the number OpenWeatherMap gives us to the closest direction or something
  const directions = [
    {
      name: 'North',
      icon: <WiDirectionUp />,
    },
    {
      name: 'North-West',
      icon: <WiDirectionUpLeft />,
    },
    {
      name: 'West',
      icon: <WiDirectionLeft />,
    },
    {
      name: 'South-West',
      icon: <WiDirectionDownLeft />,
    },
    {
      name: 'South',
      icon: <WiDirectionDown />,
    },
    {
      name: 'South-East',
      icon: <WiDirectionDownRight />,
    },
    {
      name: 'East',
      icon: <WiDirectionRight />,
    },
    {
      name: 'North-East',
      icon: <WiDirectionUpRight />,
    },
  ];
  const direction =
    directions[Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8];

  return direction ? direction.icon : null;
}

WindDirectionIcon.propTypes = {
  degrees: PropTypes.number.isRequired,
};

export default memo(WindDirectionIcon);
