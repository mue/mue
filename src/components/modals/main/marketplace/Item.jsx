import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import Tooltip from '../../../helpers/tooltip/Tooltip';
import ImageCarousel from '../../../helpers/carousel/Carousel';
import { toast } from 'react-toastify';
import {
  MdIosShare,
  MdFlag,
  MdWarning,
  MdAccountCircle,
  MdBugReport,
  MdFormatQuote,
  MdImage,
  MdTranslate,
  MdOutlineKeyboardArrowRight,
  MdExpandMore,
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
      count: 5,
    };
  }

  updateAddon() {
    uninstall(this.props.data.type, this.props.data.display_name);
    install(this.props.data.type, this.props.data);
    toast(variables.getMessage('toasts.updated'));
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

  incrementCount() {
    this.setState({ count: this.props.data.data.quotes.length });
  }

  render() {
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
              {variables.getMessage('modals.main.marketplace.product.quote_warning.title')}
            </div>
          </div>
          <div className="subtitle">
            {variables.getMessage('modals.main.marketplace.product.quote_warning.description')}
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
            {variables.getMessage('modals.main.addons.product.buttons.update_addon')}
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
          <span className="mainTitle" onClick={this.props.toggleFunction}>
            <span className="backTitle">
              {variables.getMessage('modals.main.navbar.marketplace')}
            </span>
            <MdOutlineKeyboardArrowRight /> {this.props.data.display_name}
          </span>
        </div>
        <div className="itemPage">
          <div className="itemShowcase">
            {this.props.data.data.photos ? (
              <div className="embla">
                <div className="embla__container">
                  <ImageCarousel data={this.props.data.data.photos} />
                </div>
              </div>
            ) : null}
            {this.props.data.data.quotes ? (
              <>
                <table>
                  <tr>
                    <th>Quote</th>
                    <th>Author</th>
                  </tr>
                  {this.props.data.data.quotes.slice(0, this.state.count).map((quote, index) => (
                    <tr key={index}>
                      <td>{quote.quote}</td>
                      <td>{quote.author}</td>
                    </tr>
                  ))}
                </table>
                <div className="showMoreItems">
                  <span className="link" onClick={() => this.incrementCount()}>
                    <MdExpandMore /> Show All
                  </span>
                </div>
              </>
            ) : null}
            {this.props.data.data.settings ? (
              <img
                alt="product"
                draggable="false"
                src={iconsrc}
                onClick={() => this.setState({ showLightbox: true })}
              />
            ) : null}
            <span className="title">
              {variables.getMessage('modals.main.marketplace.product.description')}
            </span>
            <span dangerouslySetInnerHTML={{ __html: this.props.data.description }} />
            {/*
            {this.props.data.description.length > 100 ? (
              <div className="showMore" onClick={() => this.toggleShowMore()}>
                {this.state.showMore === true ? (
                  <>
                    <span>{variables.getMessage('modals.main.marketplace.product.show_less')}</span>
                    <MdKeyboardArrowDown />
                  </>
                ) : (
                  <>
                    <span>{variables.getMessage('modals.main.marketplace.product.show_more')}</span>
                    <MdKeyboardArrowUp />
                  </>
                )}
              </div>
                ) : null}*/}
            <div className="moreInfo">
              <div className="infoItem">
                <MdBugReport />
                <div className="text">
                  <span className="header">
                    {variables.getMessage('modals.main.marketplace.product.version')}
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
                    {variables.getMessage('modals.main.marketplace.product.author')}
                  </span>
                  <span>{this.props.data.author}</span>
                </div>
              </div>
              {this.props.data.data.quotes ? (
                <div className="infoItem">
                  <MdFormatQuote />
                  <div className="text">
                    <span className="header">
                      {variables.getMessage('modals.main.marketplace.product.no_quotes')}
                    </span>
                    <span>{this.props.data.data.quotes.length}</span>
                  </div>
                </div>
              ) : null}
              {this.props.data.data.photos ? (
                <div className="infoItem">
                  <MdImage />
                  <div className="text">
                    <span className="header">
                      {variables.getMessage('modals.main.marketplace.product.no_images')}
                    </span>
                    <span>{this.props.data.data.photos.length}</span>
                  </div>
                </div>
              ) : null}
              {!this.props.data.data.photos && this.props.data.data.language !== '' ? (
                <div className="infoItem">
                  <MdTranslate />
                  <div className="text">
                    <span className="header">
                      {variables.getMessage('modals.main.settings.sections.language.title')}
                    </span>
                    <span>{this.props.data.data.language}</span>
                  </div>
                </div>
              ) : null}
              {/*<div className="infoItem">
                <MdIosShare />
                <div className="text">
                  <span className="header">{variables.getMessage('modals.main.marketplace.product.shares')}</span>
                  <span>324</span>
                </div>
              </div>*/}
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
                <span className="subtitle">
                  {variables.getMessage('modals.main.marketplace.product.part_of')}
                </span>
                <span className="title">{this.props.data.data.collection}</span>
                <button>{variables.getMessage('modals.main.marketplace.product.explore')}</button>
              </div>
            ) : null}
            {warningHTML}
          </div>
        </div>
      </div>
    );
  }
}
