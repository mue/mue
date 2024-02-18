import variables from 'config/variables';
import { PureComponent, createRef } from 'react';
import { MdAddLink, MdLinkOff } from 'react-icons/md';
import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import Modal from 'react-modal';

import AddModal from './quicklinks/AddModal';

import EventBus from 'modules/helpers/eventbus';
import QuickLink from './quicklinks/QuickLink';
import { getTitleFromUrl, isValidUrl } from 'modules/helpers/settings/modals';

export default class QuickLinks extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('quicklinks')),
      showAddModal: false,
      urlError: '',
      iconError: '',
      edit: false,
      editData: '',
    };
    this.quicklinksContainer = createRef();
  }

  deleteLink(key, event) {
    event.preventDefault();

    // remove link from array
    const data = JSON.parse(localStorage.getItem('quicklinks')).filter((i) => i.key !== key);

    localStorage.setItem('quicklinks', JSON.stringify(data));
    this.setState({
      items: data,
    });

    variables.stats.postEvent('feature', 'Quicklink delete');
  }

  async addLink(name, url, icon) {
    const data = JSON.parse(localStorage.getItem('quicklinks'));

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    if (url.length <= 0 || isValidUrl(url) === false) {
      return this.setState({
        urlError: variables.getMessage('widgets.quicklinks.url_error'),
      });
    }

    if (icon.length > 0 && isValidUrl(icon) === false) {
      return this.setState({
        iconError: variables.getMessage('widgets.quicklinks.url_error'),
      });
    }

    data.push({
      name: name || (await getTitleFromUrl(url)),
      url,
      icon: icon || '',
      key: Math.random().toString(36).substring(7) + 1,
    });

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      showAddModal: false,
      urlError: '',
      iconError: '',
    });

    variables.stats.postEvent('feature', 'Quicklink add');
  }

  startEditLink(data) {
    this.setState({
      edit: true,
      editData: data,
      showAddModal: true,
    });
  }

  async editLink(og, name, url, icon) {
    const data = JSON.parse(localStorage.getItem('quicklinks'));
    const dataobj = data.find((i) => i.key === og.key);
    dataobj.name = name || (await getTitleFromUrl(url));
    dataobj.url = url;
    dataobj.icon = icon || '';

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      showAddModal: false,
      edit: false,
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'quicklinks') {
        if (localStorage.getItem('quicklinksenabled') === 'false') {
          return (this.quicklinksContainer.current.style.display = 'none');
        }

        this.quicklinksContainer.current.style.display = 'block';

        this.setState({
          items: JSON.parse(localStorage.getItem('quicklinks')),
        });
      }
    });
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    const QUICKLINKS_SECTION = 'modals.main.settings.sections.quicklinks';

    const AdditionalSettings = () => {
      return (
        <Row>
          <Content
            title={variables.getMessage('modals.main.settings.additional_settings')}
            subtitle={variables.getMessage(`${QUICKLINKS_SECTION}.additional`)}
          />
          <Action>
            <Checkbox
              name="quicklinksnewtab"
              text={variables.getMessage(`${QUICKLINKS_SECTION}.open_new`)}
              category="quicklinks"
            />
            <Checkbox
              name="quicklinkstooltip"
              text={variables.getMessage(`${QUICKLINKS_SECTION}.tooltip`)}
              category="quicklinks"
            />
          </Action>
        </Row>
      );
    };

    const StylingOptions = () => {
      return (
        <Row>
          <Content
            title={variables.getMessage(`${QUICKLINKS_SECTION}.styling`)}
            subtitle={variables.getMessage(
              'modals.main.settings.sections.quicklinks.styling_description',
            )}
          />
          <Action>
            <Dropdown
              label={variables.getMessage(`${QUICKLINKS_SECTION}.style`)}
              name="quickLinksStyle"
              category="quicklinks"
              items={[
                {
                  value: 'icon',
                  text: variables.getMessage(`${QUICKLINKS_SECTION}.options.icon`),
                },
                {
                  value: 'text',
                  text: variables.getMessage(`${QUICKLINKS_SECTION}.options.text_only`),
                },
                {
                  value: 'metro',
                  text: variables.getMessage(`${QUICKLINKS_SECTION}.options.metro`),
                },
              ]}
            />
          </Action>
        </Row>
      );
    };

    const AddLink = () => {
      return (
        <Row final={true}>
          <Content title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)} />
          <Action>
            <Button
              type="settings"
              onClick={() => this.setState({ showAddModal: true })}
              icon={<MdAddLink />}
              label={variables.getMessage(`${QUICKLINKS_SECTION}.add_link`)}
            />
          </Action>
        </Row>
      );
    };

    return (
      <>
        <Header
          title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)}
          setting="quicklinksenabled"
          category="quicklinks"
          element=".quicklinks-container"
          zoomSetting="zoomQuicklinks"
          visibilityToggle={true}
        />
        <PreferencesWrapper
          setting="quicklinksenabled"
          visibilityToggle={true}
          zoomSetting="zoomQuicklinks"
        >
          <AdditionalSettings />
          <StylingOptions />
          <AddLink />

          {this.state.items.length === 0 && (
            <div className="photosEmpty">
              <div className="emptyNewMessage">
                <MdLinkOff />
                <span className="title">
                  {variables.getMessage(`${QUICKLINKS_SECTION}.no_quicklinks`)}
                </span>
                <span className="subtitle">
                  {variables.getMessage('modals.main.settings.sections.message.add_some')}
                </span>
                <Button
                  type="settings"
                  onClick={() => this.setState({ showAddModal: true })}
                  icon={<MdAddLink />}
                  label={variables.getMessage(`${QUICKLINKS_SECTION}.add_link`)}
                />
              </div>
            </div>
          )}
        </PreferencesWrapper>

        <div className="messagesContainer" ref={this.quicklinksContainer}>
          {this.state.items.map((item, i) => (
            <QuickLink
              key={i}
              item={item}
              startEditLink={() => this.startEditLink(item)}
              deleteLink={(key, e) => this.deleteLink(key, e)}
            />
          ))}
        </div>
        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ showAddModal: false, urlError: '', iconError: '' })}
          isOpen={this.state.showAddModal}
          className="Modal resetmodal mainModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <AddModal
            urlError={this.state.urlError}
            addLink={(name, url, icon) => this.addLink(name, url, icon)}
            editLink={(og, name, url, icon) => this.editLink(og, name, url, icon)}
            edit={this.state.edit}
            editData={this.state.editData}
            closeModal={() =>
              this.setState({ showAddModal: false, urlError: '', iconError: '', edit: false })
            }
          />
        </Modal>
      </>
    );
  }
}
