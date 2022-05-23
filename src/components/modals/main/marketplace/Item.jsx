import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import Tooltip from '../../../helpers/tooltip/Tooltip';
import { toast } from 'react-toastify';
import {
  MdArrowBack,
  MdIosShare,
  MdFlag,
  MdWarning,
  MdAccountCircle,
  MdBugReport,
  MdFormatQuote,
  MdImage,
  MdTranslate,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from 'react-icons/md';
import Modal from 'react-modal';

import { install, uninstall } from 'modules/helpers/marketplace';

import ShareModal from '../../../helpers/sharemodal/ShareModal';

export default class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLightbox: false,
      showUpdateButton:
        this.props.addonInstalled === true &&
        this.props.addonInstalledVersion !== this.props.data.version,
      showMore: false,
      shareModal: false,
    };
  }

  updateAddon() {
    uninstall(this.props.data.type, this.props.data.display_name);
    install(this.props.data.type, this.props.data);
    toast(variables.language.getMessage(variables.languagecode, 'toasts.updated'));
    this.setState({
      showUpdateButton: false,
    });
  }

  toggleShowMore() {
    if (this.state.showMore === true) {
      this.setState({ showMore: false });
    } else {
      this.setState({ showMore: true });
    }
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    if (!this.props.data.display_name) {
      return null;
    }

    let warningHTML;
    if (this.props.data.quote_api) {
      warningHTML = (
        <div className="itemWarning">
          <div className="topRow">
            <MdWarning />
            <div className="title">
              {getMessage('modals.main.marketplace.product.quote_warning.title')}
            </div>
          </div>
          <div className="subtitle">
            {getMessage('modals.main.marketplace.product.quote_warning.description')}
          </div>
        </div>
      );
    }

    // prevent console error
    let iconsrc = variables.constants.DDG_IMAGE_PROXY + this.props.data.icon;
    if (!this.props.data.icon) {
      iconsrc = null;
    }

    let updateButton;
    if (this.state.showUpdateButton) {
      updateButton = (
        <Fragment key="update">
          <button className="removeFromMue" onClick={() => this.updateAddon()}>
            {getMessage('modals.main.addons.product.buttons.update_addon')}
          </button>
        </Fragment>
      );
    }

    return (
      <div id="item">
        <Modal
          closeTimeoutMS={300}
          isOpen={this.state.shareModal}
          className="Modal mainModal"
          overlayClassName="Overlay"
          ariaHideApp={false}
          onRequestClose={() => this.setState({ shareModal: false })}
        >
          <ShareModal
            data={variables.constants.MARKETPLACE_URL + '/share/' + btoa(this.props.data.api_name)}
            modalClose={() => this.setState({ shareModal: false })}
          />
        </Modal>
        <div className="flexTopMarketplace">
          <div className="returnButton">
            <Tooltip title="back" key="backArrow">
              <MdArrowBack className="backArrow" onClick={this.props.toggleFunction} />
            </Tooltip>
          </div>
          <span className="mainTitle">Marketplace</span>
        </div>
        <div className="itemPage">
          <div className="itemShowcase">
            <div className="titleTop">
              <span className="itemTitle">{this.props.data.display_name}</span>
              <span className="subtitle">{this.props.data.author}</span>
            </div>
            <img
              alt="product"
              draggable="false"
              src={iconsrc}
              onClick={() => this.setState({ showLightbox: true })}
            />
            <span className="title">Description</span>
            <span
              className={this.state.showMore ? 'description' : 'description truncate'}
              dangerouslySetInnerHTML={{ __html: this.props.data.description }}
            />
            {this.props.data.description.length > 100 ? (
              <div className="showMore" onClick={() => this.toggleShowMore()}>
                {this.state.showMore === true ? (
                  <>
                    <span>Show Less</span>
                    <MdKeyboardArrowDown />
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <MdKeyboardArrowUp />
                  </>
                )}
              </div>
            ) : null}
            <div className="moreInfo">
              <div className="infoItem">
                <MdBugReport />
                <div className="text">
                  <span className="header">
                    {getMessage('modals.main.marketplace.product.version')}
                  </span>
                  {updateButton ? (
                    <span>
                      {this.props.data.version} (Installed: {this.props.data.addonInstalledVersion})
                    </span>
                  ) : (
                    <span>{this.props.data.version}</span>
                  )}
                </div>
              </div>
              <div className="infoItem">
                <MdAccountCircle />
                <div className="text">
                  <span className="header">
                    {getMessage('modals.main.marketplace.product.author')}
                  </span>
                  <span>{this.props.data.author}</span>
                </div>
              </div>
              {this.props.data.data.quotes ? (
                <div className="infoItem">
                  <MdFormatQuote />
                  <div className="text">
                    <span className="header">No. Quotes</span>
                    <span>{this.props.data.data.quotes.length}</span>
                  </div>
                </div>
              ) : null}
              {this.props.data.data.photos ? (
                <div className="infoItem">
                  <MdImage />
                  <div className="text">
                    <span className="header">No. Images</span>
                    <span>{this.props.data.data.photos.length}</span>
                  </div>
                </div>
              ) : null}
              {!this.props.data.data.photos && this.props.data.data.language !== '' ? (
                <div className="infoItem">
                  <MdTranslate />
                  <div className="text">
                    <span className="header">Language</span>
                    <span>{this.props.data.data.language}</span>
                  </div>
                </div>
              ) : null}
              <div className="infoItem">
                <MdIosShare />
                <div className="text">
                  <span className="header">Shares</span>
                  <span>324</span>
                </div>
              </div>
            </div>
          </div>
          <div className="itemInfo">
            <img
              alt="icon"
              draggable="false"
              src={variables.constants.DDG_IMAGE_PROXY + this.props.data.data.icon_url}
            />
            {this.props.button}
            <div className="iconButtons">
              <Tooltip title="Share" key="share">
                <button onClick={() => this.setState({ shareModal: true })}>
                  <MdIosShare />
                </button>
              </Tooltip>
              <Tooltip title="Report" key="report">
                <button
                  onClick={() =>
                    window.open(
                      variables.constants.REPORT_ITEM +
                        this.props.data.display_name.split(' ').join('+'),
                      '_blank',
                    )
                  }
                >
                  <MdFlag />
                </button>
              </Tooltip>
            </div>
            {this.props.data.data.collection ? (
              <div className="inCollection">
                <span className="subtitle">Part of</span>
                <span className="title">Red Dead Collection</span>
                <button>Explore</button>
              </div>
            ) : null}
            {warningHTML}
          </div>
        </div>
      </div>
    );
  }
}
