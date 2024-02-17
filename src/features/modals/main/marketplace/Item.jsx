import variables from 'config/variables';
import { PureComponent, Fragment } from 'react';
import { Tooltip } from 'components/Elements';
import ImageCarousel from 'features/helpers/carousel/Carousel';
import { toast } from 'react-toastify';
import {
  MdIosShare,
  MdFlag,
  MdAccountCircle,
  MdBugReport,
  MdFormatQuote,
  MdImage,
  MdTranslate,
  MdExpandMore,
  MdExpandLess,
  MdStyle,
} from 'react-icons/md';
import Modal from 'react-modal';

import Header from '../settings/Header';
import { Button } from 'components/Elements';

import { install, uninstall } from 'modules/helpers/marketplace';

import { ShareModal } from 'components/Elements';

class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLightbox: false,
      showUpdateButton:
        this.props.addonInstalled === true &&
        this.props.addonInstalledVersion !== this.props.data.version,
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

  incrementCount(type) {
    const newCount =
      this.state.count !== this.props.data.data[type].length
        ? this.props.data.data[type].length
        : 5;

    this.setState({ count: newCount });
  }

  getName(name) {
    const nameMappings = {
      photos: 'photo_packs',
      quotes: 'quote_packs',
      settings: 'preset_settings',
    };
    return nameMappings[name] || name;
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

    const moreInfoItem = (icon, header, text) => (
      <div className="infoItem">
        {icon}
        <div className="text">
          <span className="header">{header}</span>
          <span>{text}</span>
        </div>
      </div>
    );

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
            data={
              variables.constants.API_URL + '/marketplace/share/' + btoa(this.props.data.api_name)
            }
            modalClose={() => this.setState({ shareModal: false })}
          />
        </Modal>
        <Header
          title={variables.getMessage('modals.main.navbar.marketplace')}
          secondaryTitle={this.props.data.data.display_name}
          report={false}
          goBack={this.props.toggleFunction}
        />
        <div className="itemPage">
          <div className="itemShowcase">
            {this.props.data.data.photos && (
              <div className="carousel">
                <div className="carousel_container">
                  <ImageCarousel data={this.props.data.data.photos} />
                </div>
              </div>
            )}
            {this.props.data.data.settings && (
              <img
                alt="product"
                draggable={false}
                src={iconsrc}
                onClick={() => this.setState({ showLightbox: true })}
              />
            )}
            {this.props.data.data.quotes && (
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
            )}
            {this.props.data.data.settings && (
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
            )}
            <div>
              <p className="title">
                {variables.getMessage('modals.main.marketplace.product.description')}
              </p>
              <p dangerouslySetInnerHTML={{ __html: this.props.data.description }} />
            </div>
            <div className="moreInfo">
              {moreInfoItem(
                <MdBugReport />,
                variables.getMessage('modals.main.marketplace.product.version'),
                updateButton ? (
                  <span>
                    {this.props.data.version} (Installed: {this.props.data.addonInstalledVersion})
                  </span>
                ) : (
                  <span>{this.props.data.version}</span>
                ),
              )}
              {moreInfoItem(
                <MdAccountCircle />,
                variables.getMessage('modals.main.marketplace.product.author'),
                this.props.data.author,
              )}
              {this.props.data.data.quotes &&
                moreInfoItem(
                  <MdFormatQuote />,
                  variables.getMessage('modals.main.marketplace.product.no_quotes'),
                  this.props.data.data.quotes.length,
                )}
              {this.props.data.data.photos &&
                moreInfoItem(
                  <MdImage />,
                  variables.getMessage('modals.main.marketplace.product.no_images'),
                  this.props.data.data.photos.length,
                )}
              {this.props.data.data.quotes && this.props.data.data.language !== ''
                ? moreInfoItem(
                    <MdTranslate />,
                    variables.getMessage('modals.main.settings.sections.language.title'),
                    this.props.data.data.language,
                  )
                : null}
              {moreInfoItem(
                <MdStyle />,
                variables.getMessage('modals.main.settings.sections.background.type.title'),
                variables.getMessage(
                  'modals.main.marketplace.' + this.getName(this.props.data.data.type),
                ) || 'marketplace',
              )}
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
                <Button
                  type="icon"
                  onClick={() => this.setState({ shareModal: true })}
                  icon={<MdIosShare />}
                  tooltipTitle={variables.getMessage('widgets.quote.share')}
                  tooltipKey="share"
                />
                <Button
                  type="icon"
                  onClick={() => this.setState({ shareModal: true })}
                  icon={<MdFlag />}
                  tooltipTitle={variables.getMessage(
                    'modals.main.marketplace.product.buttons.report',
                  )}
                  tooltipKey="report"
                />
              </div>
              {this.props.data.data.collection && (
                <div className="inCollection">
                  <span className="subtitle">
                    {variables.getMessage('modals.main.marketplace.product.part_of')}
                  </span>
                  <span className="title">{this.props.data.data.collection}</span>
                  <button>{variables.getMessage('modals.main.marketplace.product.explore')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
