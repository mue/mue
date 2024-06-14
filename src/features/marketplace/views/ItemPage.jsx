import variables from 'config/variables';
import { PureComponent, Fragment } from 'react';
import { toast } from 'react-toastify';
import {
  MdIosShare,
  MdFlag,
  MdAccountCircle,
  MdCalendarMonth,
  MdFormatQuote,
  MdImage,
  MdTranslate,
  MdOutlineWarning,
  MdStyle,
  MdClose,
  MdLibraryAdd,
} from 'react-icons/md';
import Modal from 'react-modal';

import { Header } from 'components/Layout/Settings';
import { Button } from 'components/Elements';

import { install, uninstall } from 'utils/marketplace';
import { Carousel } from '../components/Elements/Carousel';
import { ShareModal } from 'components/Elements';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { Items } from '../components/Items/Items';

import Markdown from 'markdown-to-jsx';

class ItemPage extends PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {
      showUpdateButton:
        this.props.data.local.installed === true && this.props.data.local.version !== this.props.data.version,
      shareModal: false,
      count: 5,
      moreByCurator: [],
    };
    this.buttons = {
      uninstall: (
        <Button
          type="settings"
          onClick={() => this.manage('uninstall')}
          icon={<MdClose />}
          label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
        />
      ),
      install: (
        <Button
          type="settings"
          onClick={() => this.manage('install')}
          icon={<MdLibraryAdd />}
          label={variables.getMessage('modals.main.marketplace.product.buttons.addtomue')}
        />
      ),
    };
  }

  async getCurator(name) {
    try {
      const { data } = await (
        await fetch(`${variables.constants.API_URL}/marketplace/curator/${name}`)
      ).json();
      this.setState({
        moreByCurator: data.items,
      });
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
    this.getCurator(this.props.data.author);
    document.querySelector('#modal').scrollTop = 0;
    this.setState({
      button: this.props.data.local.installed ? this.buttons.uninstall : this.buttons.install,
    })
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

  manage(type) {
    if (type === 'install') {
      install(this.props.data.type, this.props.data.data);
    } else {
      uninstall(this.props.data.type,this.props.data.display_name);
    }

    toast(variables.getMessage('toasts.' + type + 'ed'));
    this.setState({
      button: type === 'install' ? this.buttons.uninstall : this.buttons.install,
    });

    variables.stats.postEvent(
      'marketplace-item',
      `${this.state.item.display_name} ${type === 'install' ? 'installed' : 'uninstalled'}`,
    );

    variables.stats.postEvent('marketplace', type === 'install' ? 'Install' : 'Uninstall');
  }

  render() {
    const locale = localStorage.getItem('language');
    const shortLocale = locale.includes('_') ? locale.split('_')[0] : locale;
    let languageNames = new Intl.DisplayNames([shortLocale], { type: 'language' });

    const convertedType = (() => {
      const map = {
        photos: 'photo_packs',
        quotes: 'quote_packs',
        settings: 'preset_settings',
      };
      return map[this.props.data.data.type];
    })();

    const moreByCurator = this.state.moreByCurator
      .filter((item) => item.type === convertedType && item.name !== this.props.data.data.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (!this.props.data.display_name) {
      return null;
    }

    // prevent console error
    let iconsrc = this.props.data.icon;
    if (!this.props.data.icon) {
      iconsrc = null;
    }

    let updateButton;
    if (this.state.showUpdateButton) {
      updateButton = (
        <Fragment key="update">
          <Button
            type="settings"
            onClick={() => this.updateAddon()}
            label={variables.getMessage('modals.main.addons.product.buttons.update_addon')}
          />
        </Fragment>
      );
    }

    const itemWarning = () => {
      const template = (message) => (
        <div className="itemWarning">
          <MdOutlineWarning />
          <div className="text">
            <span className="header">Warning</span>
            <span>{message}</span>
          </div>
        </div>
      );

      if (this.props.data.data.sideload === true) {
        return template(variables.getMessage('modals.main.marketplace.product.sideload_warning'));
      }

      if (this.props.data.data.image_api === true) {
        return template(variables.getMessage('modals.main.marketplace.product.third_party_api'));
      }

      if (this.props.data.data.language !== undefined && this.props.data.data.language !== null) {
        if (shortLocale !== this.props.data.data.language) {
          return template(variables.getMessage('modals.main.marketplace.product.not_in_language'));
        }
      }

      return null;
    };

    const moreInfoItem = (icon, header, text) => (
      <div className="infoItem">
        {icon}
        <div className="text">
          <span className="header">{header}</span>
          <span>{text}</span>
        </div>
      </div>
    );

    let dateObj, formattedDate;
    if (this.props.data.data.updated_at) {
      dateObj = new Date(this.props.data.data.updated_at);
      formattedDate = new Intl.DateTimeFormat(shortLocale, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }).format(dateObj);
    }

    return (
      <>
        <Modal
          closeTimeoutMS={300}
          isOpen={this.state.shareModal}
          className="Modal mainModal"
          overlayClassName="Overlay"
          ariaHideApp={false}
          onRequestClose={() => this.setState({ shareModal: false })}
        >
          <ShareModal
            data={variables.constants.API_URL + '/marketplace/share/' + btoa(this.props.data.slug)}
            modalClose={() => this.setState({ shareModal: false })}
          />
        </Modal>
        <Header
          title={
            this.props.addons
              ? variables.getMessage('modals.main.addons.added')
              : this.props.data.onCollection && this.props.data.data.in_collections?.length > 0
                ? this.props.data.data.in_collections[0].display_name
                : variables.getMessage('modals.main.navbar.marketplace')
          }
          secondaryTitle={
            this.props.data.data.sideload
              ? this.props.data.data.name
              : this.props.data.data.display_name
          }
          report={false}
          goBack={this.props.toggleFunction}
        />
        <div className="itemPage">
          <div className="itemShowcase">
            <div className="subHeader">
              {moreInfoItem(
                <MdAccountCircle />,
                variables.getMessage('modals.main.marketplace.product.created_by'),
                this.props.data.author,
              )}
              {itemWarning()}
            </div>
            {this.props.data.data.photos && (
              <div className="carousel">
                <div className="carousel_container">
                  <Carousel data={this.props.data.data.photos} />
                </div>
              </div>
            )}
            {this.props.data.data.settings && (
              <img
                alt="product"
                draggable={false}
                src={iconsrc}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderIcon;
                }}
              />
            )}
            <div className="marketplaceDescription">
              <span className="title">
                {variables.getMessage('modals.main.marketplace.product.description')}
              </span>
              <Markdown>{this.props.data.data.description}</Markdown>
            </div>
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
                    {this.state.count !== this.props.data.data.quotes.length
                      ? variables.getMessage('modals.main.marketplace.product.show_all')
                      : variables.getMessage('modals.main.marketplace.product.show_less')}
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
                    {this.state.count !== this.props.data.data.settings.length
                      ? variables.getMessage('modals.main.marketplace.product.show_all')
                      : variables.getMessage('modals.main.marketplace.product.show_less')}
                  </span>
                </div>
              </>
            )}
            <div className="marketplaceDescription">
              <span className="title">
                {variables.getMessage('modals.main.marketplace.product.details')}
              </span>
              <div className="moreInfo">
                {this.props.data.data.updated_at &&
                  moreInfoItem(
                    <MdCalendarMonth />,
                    variables.getMessage('modals.main.marketplace.product.updated_at'),
                    formattedDate,
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
                {this.props.data.data.quotes && this.props.data.data.language
                  ? moreInfoItem(
                      <MdTranslate />,
                      variables.getMessage('modals.main.settings.sections.language.title'),
                      languageNames.of(this.props.data.data.language),
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
          </div>
          <div
            className="itemInfo"
            style={{
              backgroundImage: `url("${this.props.data.data.icon_url}")`,
            }}
          >
            <div className="front">
              <img
                className="icon"
                alt="icon"
                draggable={false}
                src={this.props.data.data.icon_url}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderIcon;
                }}
              />
              {localStorage.getItem('welcomePreview') !== 'true' ? (
                this.state.button
              ) : (
                <p style={{ textAlign: 'center' }}>
                  {variables.getMessage(
                    'modals.main.marketplace.product.buttons.not_available_preview',
                  )}
                </p>
              )}
              {this.props.data.data.sideload !== true && (
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
                    onClick={() =>
                      window.open(
                        variables.constants.REPORT_ITEM +
                          this.props.data.data.display_name.split(' ').join('+'),
                        '_blank',
                      )
                    }
                    icon={<MdFlag />}
                    tooltipTitle={variables.getMessage(
                      'modals.main.marketplace.product.buttons.report',
                    )}
                    tooltipKey="report"
                  />
                </div>
              )}
              {this.props.data.data.in_collections?.length > 0 && (
                <div>
                  <div className="inCollection">
                    <span className="subtitle">
                      {variables.getMessage('modals.main.marketplace.product.part_of')}
                    </span>
                    <span
                      className="title"
                      onClick={() =>
                        this.props.toggleFunction(
                          'collection',
                          this.props.data.data.in_collections[0].name,
                        )
                      }
                    >
                      {this.props.data.data.in_collections[0].display_name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {moreByCurator.length > 1 && (
          <div className="moreFromCurator">
            <span className="title">
              {variables.getMessage('modals.main.marketplace.product.more_from_curator', {
                name: this.props.data.author,
              })}
            </span>
            <div>
              <Items
                isCurator={true}
                type={this.props.data.data.type}
                items={moreByCurator}
                onCollection={this.state.collection}
                toggleFunction={(input) => this.props.toggleFunction('item', input)}
                collectionFunction={(input) => this.props.toggleFunction('collection', input)}
                filter={''}
                moreByCreator={true}
                showCreateYourOwn={false}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}

export { ItemPage as default, ItemPage };
