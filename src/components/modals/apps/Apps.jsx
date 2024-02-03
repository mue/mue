import variables from 'modules/variables';
import { MdLinkOff } from 'react-icons/md';

import Tooltip from 'components/helpers/tooltip/Tooltip';

import './scss/index.scss';

const Apps = ({ appsInfo }) => {
  return (
    <div className="appsShortcutContainer">
      {appsInfo.length > 0 ? (
        appsInfo.map((info, i) => (
          <Tooltip
            title={info.name.split(' ')[0]}
            subtitle={info.name.split(' ').slice(1).join(' ')}
            key={i}
          >
            <a href={info.url} className="appsIcon">
              <img
                src={
                  info.icon === ''
                    ? `https://icon.horse/icon/ ${info.url.replace('https://', '').replace('http://', '')}`
                    : info.icon
                }
                width="40px"
                height="40px"
                alt="Google"
              />
              <span>{info.name}</span>
            </a>
          </Tooltip>
        ))
      ) : (
        <div className="noAppsContainer">
          <div className="emptyNewMessage">
            <MdLinkOff />
            <span className="title">
              {variables.language.getMessage(variables.languagecode, 'widgets.navbar.apps.no_apps')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apps;
