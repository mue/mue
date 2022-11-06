import { memo } from 'react';

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
    'North',
    'North-West',
    'West',
    'South-West',
    'South',
    'South-East',
    'East',
    'North-East',
  ];
  const direction =
    directions[Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8];

  switch (direction) {
    case 'North':
      return <WiDirectionUp />;
    case 'North-West':
      return <WiDirectionUpLeft />;
    case 'West':
      return <WiDirectionLeft />;
    case 'South-West':
      return <WiDirectionDownLeft />;
    case 'South':
      return <WiDirectionDown />;
    case 'South-East':
      return <WiDirectionDownRight />;
    case 'East':
      return <WiDirectionRight />;
    case 'North-East':
      return <WiDirectionUpRight />;
    default:
      return null;
  }
}

export default memo(WindDirectionIcon);
