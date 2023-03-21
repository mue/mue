import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'components/helpers/tooltip/Tooltip';
import ImageCarousel from 'components/helpers/carousel/Carousel';
import { toast } from 'react-toastify';
import {
  MdIosShare,
  MdFlag,
  MdAccountCircle,
  MdBugReport,
  MdFormatQuote,
  MdImage,
  MdTranslate,
  MdOutlineKeyboardArrowRight,
  MdExpandMore,
  MdExpandLess,
  MdStyle,
} from 'react-icons/md';
import Modal from 'react-modal';

import { install, uninstall } from 'modules/helpers/marketplace';

import ShareModal from 'components/helpers/sharemodal/ShareModal';

class Item extends PureComponent {
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

  incrementCount(type) {
    if (this.state.count !== this.props.data.data[type].length) {
      this.setState({ count: this.props.data.data[type].length });
    } else {
      this.setState({ count: 5 });
    }
  }

  render() {
    if (!this.props.data.display_name) {
      return null;
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
              <div className="carousel">
                <div className="carousel_container">
                  <ImageCarousel data={this.props.data.data.photos} />
                </div>
              </div>
            ) : null}
            {this.props.data.data.settings ? (
              <img
                alt="product"
                draggable={false}
                src={iconsrc}
                onClick={() => this.setState({ showLightbox: true })}
              />
            ) : null}
            {this.props.data.data.quotes ? (
              <>
                <table>
                  <tbody>
                    <tr>
                      <th>{variables.getMessage('modals.main.settings.sections.quote.title')}</th>
                      <th>{variables.getMessage('modals.main.settings.sections.quote.author')}</th>
                    </tr>
                    {this.props.data.data.quotes.slice(0, this.state.count).map((quote, index) => (
                      <tr key={index}>
                        <td>{quote.quote}</td>
                        <td>{quote.author}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="showMoreItems">
                  <span className="link" onClick={() => this.incrementCount('quotes')}>
                    {this.state.count !== this.props.data.data.quotes.length ? (
                      <>
                        <MdExpandMore />{' '}
                        {variables.getMessage('modals.main.marketplace.product.show_all')}
                      </>
                    ) : (
                      <>
                        <MdExpandLess />{' '}
                        {variables.getMessage('modals.main.marketplace.product.show_less')}
                      </>
                    )}
                  </span>
                </div>
              </>
            ) : null}
            {this.props.data.data.settings ? (
              <>
                <table>
                  <tbody>
                    <tr>
                      <th>{variables.getMessage('modals.main.marketplace.product.setting')}</th>
                      <th>{variables.getMessage('modals.main.marketplace.product.value')}</th>
                    </tr>
                    {Object.entries(this.props.data.data.settings)
                      .slice(0, this.state.count)
                      .map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="showMoreItems">
                  <span className="link" onClick={() => this.incrementCount('settings')}>
                    {this.state.count !== this.props.data.data.settings.length ? (
                      <>
                        <MdExpandMore />{' '}
                        {variables.getMessage('modals.main.marketplace.product.show_all')}
                      </>
                    ) : (
                      <>
                        <MdExpandLess />{' '}
                        {variables.getMessage('modals.main.marketplace.product.show_less')}
                      </>
                    )}
                  </span>
                </div>
              </>
            ) : null}
            <div>
              <p className="title">
                {variables.getMessage('modals.main.marketplace.product.description')}
              </p>
              <p dangerouslySetInnerHTML={{ __html: this.props.data.description }} />
            </div>
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
              {this.props.data.data.quotes && this.props.data.data.language !== '' ? (
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
              <div className="infoItem">
                <MdStyle />
                <div className="text">
                  <span className="header">
                    {' '}
                    {variables.getMessage('modals.main.settings.sections.background.type.title')}
                  </span>
                  <span>
                    {' '}
                    {variables.getMessage(
                      'modals.main.addons.create.types.' + this.props.data.data.type,
                    ) || 'marketplace'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="itemInfo"
            style={{
              backgroundImage: `url("${
                variables.constants.DDG_IMAGE_PROXY + this.props.data.data.icon_url
              }")`,
            }}
          >
            <div className="front">
              <img
                className="icon"
                alt="icon"
                draggable={false}
                src={variables.constants.DDG_IMAGE_PROXY + this.props.data.data.icon_url}
              />
              {this.props.button}
              <div className="iconButtons">
                <Tooltip title={variables.getMessage('widgets.quote.share')} key="share">
                  <button onClick={() => this.setState({ shareModal: true })}>
                    <MdIosShare />
                  </button>
                </Tooltip>
                <Tooltip
                  title={variables.getMessage('modals.main.marketplace.product.buttons.report')}
                  key="report"
                >
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Item.propTypes = {
  data: PropTypes.object,
  addonInstalled: PropTypes.bool,
  addonInstalledVersion: PropTypes.string,
  toggleFunction: PropTypes.func,
};

export default Item;
