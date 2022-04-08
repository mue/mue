import {
  WiDirectionDownLeft,
  WiDirectionDownRight,
  WiDirectionDown,
  WiDirectionLeft,
  WiDirectionRight,
  WiDirectionUpLeft,
  WiDirectionUpRight,
  WiDirectionUp,
} from "react-icons/wi";

// degrees are imported because of a potential bug, IDK what causes it, but now it is fixed
export default function WindDirectionIcon({ degrees }) {
  let icon;

  // convert the number OpenWeatherMap gives us to the closest direction or something
  const directions = [
    "North",
    "North-West",
    "West",
    "South-West",
    "South",
    "South-East",
    "East",
    "North-East",
  ];
  const direction =
    directions[
      Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8
    ];

  switch (direction) {
    case "North":
      icon = <WiDirectionUp />;
      break;
    case "North-West":
      icon = <WiDirectionUpLeft />;
      break;
    case "West":
      icon = <WiDirectionLeft />;
      break;
    case "South-West":
      icon = <WiDirectionDownLeft />;
      break;
    case "South":
      icon = <WiDirectionDown />;
      break;
    case "South-East":
      icon = <WiDirectionDownRight />;
      break;
    case "East":
      icon = <WiDirectionRight />;
      break;
    case "North-East":
      icon = <WiDirectionUpRight />;
      break;
    default:
      icon = null;
      break;
  }

  return icon;
}
