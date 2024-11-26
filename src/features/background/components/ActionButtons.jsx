import { Tooltip } from 'components/Elements';
import {
  MdIosShare as Share,
  MdGetApp as Download,
  MdVisibilityOff as VisibilityOff,
} from 'react-icons/md';
import Favourite from './Favourite';
import { downloadImage } from '../api/utils';
import variables from 'config/variables';

const ActionButtons = ({
  info,
  favouriteTooltipText,
  setFavouriteTooltipText,
  openShareModal,
  openExcludeModal,
}) => {
  return (
    <div className="buttons">
      {!info.offline && (
        <Tooltip title={variables.getMessage('widgets.quote.share')} key="share" placement="top">
          <Share onClick={() => openShareModal(true)} />
        </Tooltip>
      )}
      <Tooltip title={favouriteTooltipText} key="favourite" placement="top">
        <Favourite
          pun={info.pun}
          offline={info.offline}
          credit={info.credit}
          photoURL={info.url}
          tooltipText={(text) => setFavouriteTooltipText(text)}
        />
      </Tooltip>
      {!info.offline && (
        <Tooltip
          title={variables.getMessage('widgets.background.download')}
          key="download"
          placement="top"
        >
          <Download onClick={() => downloadImage(info)} />
        </Tooltip>
      )}
      {info.pun && info.category && (
        <Tooltip
          title={variables.getMessage('widgets.background.exclude')}
          key="exclude"
          placement="top"
        >
          <VisibilityOff onClick={() => openExcludeModal(true)} />
        </Tooltip>
      )}
    </div>
  );
};

export default ActionButtons;
