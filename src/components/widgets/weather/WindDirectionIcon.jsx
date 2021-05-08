import React from 'react';
import { WiDirectionDownLeft, WiDirectionDownRight, WiDirectionDown, WiDirectionLeft, WiDirectionRight, WiDirectionUpLeft, WiDirectionUpRight, WiDirectionUp } from 'weather-icons-react';

export default function WindDirectionIcon(props) {
  let icon;

  // convert the number openweathermap gives us to closest direction or something
  const directions = ['North', 'North-West', 'West', 'South-West', 'South', 'South-East', 'East', 'North-East'];
  const direction = directions[Math.round(((props.degrees %= 360) < 0 ? props.degrees + 360 : props.degrees) / 45) % 8];

  switch (direction) {
    case 'North': icon = <WiDirectionUp/>; break;
    case 'North-West': icon = <WiDirectionUpLeft/>; break;
    case 'West': icon = <WiDirectionLeft/>; break;
    case 'South-West': icon = <WiDirectionDownLeft/>; break;
    case 'South': icon = <WiDirectionDown/>; break;
    case 'South-East': icon = <WiDirectionDownRight/>; break;
    case 'East': icon = <WiDirectionRight/>; break;
    case 'North-East': icon = <WiDirectionUpRight/>; break;
    default: icon = null; break;
  }

  return icon;
}