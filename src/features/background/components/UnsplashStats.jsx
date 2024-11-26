import {
  MdFavorite as MdFavourite,
  MdGetApp as Download,
  MdVisibility as Views,
} from 'react-icons/md';
import variables from 'config/variables';

const UnsplashStats = ({ info }) => {
  return (
    <div className="unsplashStats">
      <div title={variables.getMessage('widgets.background.views')}>
        <Views />
        <span>{info.views.toLocaleString()}</span>
      </div>
      <div title={variables.getMessage('widgets.background.downloads')}>
        <Download />
        <span>{info.downloads.toLocaleString()}</span>
      </div>
      {!!info.likes && (
        <div title={variables.getMessage('widgets.background.likes')}>
          <MdFavourite />
          <span>{info.likes.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default UnsplashStats;
