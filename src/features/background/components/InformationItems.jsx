import {
  MdLocationOn,
  MdPhotoCamera,
  MdCrop as Resolution,
  MdCategory as Category,
  MdSource as Source,
} from 'react-icons/md';
import variables from 'config/variables';

const InformationItems = ({ info, width, height, api }) => {
  return (
    <div className="extra-content">
      {info.location && info.location !== 'N/A' && (
        <div className="row" title={variables.getMessage('widgets.background.location')}>
          <MdLocationOn />
          <span id="infoLocation">{info.location}</span>
        </div>
      )}
      {info.camera && info.camera !== 'N/A' && (
        <div className="row" title={variables.getMessage('widgets.background.camera')}>
          <MdPhotoCamera />
          <span id="infoCamera">{info.camera}</span>
        </div>
      )}
      <div className="row" title={variables.getMessage('widgets.background.resolution')}>
        <Resolution />
        <span id="infoResolution">
          {width}x{height}
        </span>
      </div>
      {info.category && (
        <div className="row" title={variables.getMessage('widgets.background.category')}>
          <Category />
          <span id="infoCategory">{info.category[0].toUpperCase() + info.category.slice(1)}</span>
        </div>
      )}
      {api && (
        <div className="row" title={variables.getMessage('widgets.background.source')}>
          <Source />
          <span id="infoSource">
            {info.photoURL ? (
              <a href={info.photoURL} target="_blank" rel="noopener noreferrer" className="link">
                {api.charAt(0).toUpperCase() + api.slice(1)}
              </a>
            ) : (
              <a href={info.url} target="_blank" rel="noopener noreferrer" className="link">
                {api.charAt(0).toUpperCase() + api.slice(1)}
              </a>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default InformationItems;
