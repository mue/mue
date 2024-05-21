import variables from 'config/variables';
import { PureComponent, Fragment } from 'react';
import { toast } from 'react-toastify';
import {
  MdIosShare,
  MdFlag,
  MdAccountCircle,
  MdBugReport,
  MdFormatQuote,
  MdImage,
  MdTranslate,
  MdOutlineWarning,
  MdStyle,
} from 'react-icons/md';
import Modal from 'react-modal';

import { Header } from 'components/Layout/Settings';
import { Button } from 'components/Elements';

import { install, uninstall } from 'utils/marketplace';
import { Carousel } from '../Elements/Carousel';
import { ShareModal } from 'components/Elements';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { Items } from './Items';

class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateButton:
        this.props.addonInstalled === true &&
        this.props.addonInstalledVersion !== this.props.data.version,
      shareModal: false,
      count: 5,
      moreByCurator: [],
    };
  }

  async getCurator(name) {
    try {
      const { data } = await (
        await fetch(`${variables.constants.API_URL}/marketplace/curator/${name}`)
      ).json();
      const convertedType = (() => {
        const map = {
          photos: 'photo_packs',
          quotes: 'quote_packs',
          settings: 'preset_settings',
        };
        return map[this.props.data.data.type];
      })();
      this.setState({
        moreByCurator: data.items.filter(
          (item) => item.type === convertedType && item.name !== this.props.data.data.name,
        ),
      });
      console.log(this.state.curator);
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
    this.getCurator(this.props.data.author);
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
    const locale = localStorage.getItem('language');
    const shortLocale = locale.includes('_') ? locale.split('_')[0] : locale;
    let languageNames = new Intl.DisplayNames([shortLocale], { type: 'language' });

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

    let itemWarning;
    if (
      this.props.data.data.language !== undefined &&
      this.props.data.data.language !== null &&
      shortLocale !== this.props.data.data.language
    ) {
      itemWarning = (
        <div className="itemWarning">
          <MdOutlineWarning />
          <div className="text">
            <span className="header">Warning</span>
            <span>{variables.getMessage('modals.main.marketplace.product.not_in_language')}</span>
          </div>
        </div>
      );
    }

    if (this.props.data.data.image_api === true) {
      itemWarning = (
        <div className="itemWarning">
          <MdOutlineWarning />
          <div className="text">
            <span className="header">Warning</span>
            <span>{variables.getMessage('modals.main.marketplace.product.third_party_api')}</span>
          </div>
        </div>
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

    const DataTable = ({ data, title, value, incrementCount, count }) => (
      <>
        <table>
          <tbody>
            <tr>
              <th>{variables.getMessage(title)}</th>
              <th>{variables.getMessage(value)}</th>
            </tr>
            {data.slice(0, count).map((item, index) => (
              <tr key={index}>
                <td>{item.quote || item.key}</td>
                <td>{item.author || item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="showMoreItems">
          <span className="link" onClick={incrementCount}>
            {count !== data.length
              ? variables.getMessage('modals.main.marketplace.product.show_all')
              : variables.getMessage('modals.main.marketplace.product.show_less')}
          </span>
        </div>
      </>
    );

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
            data={
              variables.constants.API_URL + '/marketplace/share/' + btoa(this.props.data.api_name)
            }
            modalClose={() => this.setState({ shareModal: false })}
          />
        </Modal>
        <Header
          title={
            this.props.data.data.in_collections.length > 0
              ? this.props.data.data.in_collections[0].display_name
              : variables.getMessage('modals.main.navbar.marketplace')
          }
          secondaryTitle={this.props.data.data.display_name}
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
              {itemWarning}
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
              <span
                className="subtitle"
                dangerouslySetInnerHTML={{ __html: this.props.data.description }}
              />
            </div>
            {this.props.data.data.quotes && (
              <DataTable
                data={this.props.data.data.quotes}
                title="modals.main.settings.sections.quote.title"
                value="modals.main.settings.sections.quote.author"
                incrementCount={() => this.incrementCount('quotes')}
                count={this.state.count}
              />
            )}
            {this.props.data.data.settings && (
              <DataTable
                data={Object.entries(this.props.data.data.settings)}
                title="modals.main.marketplace.product.setting"
                value="modals.main.marketplace.product.value"
                incrementCount={() => this.incrementCount('settings')}
                count={this.state.count}
              />
            )}
            <div className="marketplaceDescription">
              <span className="title">
                {variables.getMessage('modals.main.marketplace.product.details')}
              </span>
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
              {this.props.data.data.in_collections.length > 0 && (
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
        {this.state.moreByCurator.length > 1 && (
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
                items={this.state.moreByCurator}
                onCollection={this.state.collection}
                toggleFunction={(input) => this.props.toggleFunction('item', input)}
                collectionFunction={(input) => this.props.toggleFunction('collection', input)}
                filter={''}
                moreByCreator={true}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}

export { Item as default, Item };
