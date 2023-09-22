import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdUpdate, MdOutlineExtensionOff, MdCode } from 'react-icons/md';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import SideloadFailedModal from '../SideloadFailedModal';
import FileUpload from '../../settings/FileUpload';
import Item from '../Item';
import Items from '../Items';
import Dropdown from '../../settings/Dropdown';

import { install, uninstall, urlParser } from 'modules/helpers/marketplace';

export default class Added extends PureComponent {
  constructor() {
    super();
    this.state = {
      installed: JSON.parse(localStorage.getItem('installed')),
      item: {},
      button: '',
      showFailed: false,
      failedReason: '',
    };
    this.buttons = {
      uninstall: (
        <button className="removeFromMue" onClick={() => this.uninstall()}>
          {variables.getMessage('modals.main.marketplace.product.buttons.remove')}
        </button>
      ),
    };
  }

  installAddon(input) {
    let failedReason = '';
    if (!input.name) {
      failedReason = variables.getMessage('modals.main.addons.sideload.errors.no_name');
    } else if (!input.author) {
      failedReason = variables.getMessage('modals.main.addons.sideload.errors.no_author');
    } else if (!input.type) {
      failedReason = variables.getMessage('modals.main.addons.sideload.errors.no_type');
    } else if (!input.version) {
      failedReason = variables.getMessage('modals.main.addons.sideload.errors.no_version');
    } else if (
      input.type === 'photos' &&
      (!input.photos ||
        !input.photos.length ||
        !input.photos[0].url ||
        !input.photos[0].url.default ||
        !input.photos[0].photographer ||
        !input.photos[0].location)
    ) {
      failedReason = variables.getMessage('modals.main.addons.sideload.errors.invalid_photos');
    } else if (
      input.type === 'quotes' &&
      (!input.quotes || !input.quotes.length || !input.quotes[0].quote || !input.quotes[0].author)
    ) {
      failedReason = variables.getMessage('modals.main.addons.sideload.errors.invalid_quotes');
    }

    if (failedReason !== '') {
      return this.setState({
        failedReason,
        showFailed: true,
      });
    }

    install(input.type, input);
    toast(variables.getMessage('toasts.installed'));
    variables.stats.postEvent('marketplace', 'Sideload');
  }

  toggle(type, data) {
    if (type === 'item') {
      const installed = JSON.parse(localStorage.getItem('installed'));
      const info = {
        data: installed.find((i) => i.name === data.name),
      };

      this.setState({
        item: {
          type: info.data.type,
          display_name: info.data.name,
          author: info.data.author,
          description: urlParser(info.data.description.replace(/\n/g, '<br>')),
          //updated: info.updated,
          version: info.data.version,
          icon: info.data.screenshot_url,
          data: info.data,
        },
        button: this.buttons.uninstall,
      });
      variables.stats.postEvent('marketplace', 'Item viewed');
    } else {
      this.setState({
        item: {},
      });
    }
  }

  uninstall() {
    uninstall(this.state.item.type, this.state.item.display_name);

    toast(variables.getMessage('toasts.uninstalled'));

    this.setState({
      button: '',
      installed: JSON.parse(localStorage.getItem('installed')),
    });

    variables.stats.postEvent('marketplace', 'Uninstall');
  }

  sortAddons(value, sendEvent) {
    let installed = JSON.parse(localStorage.getItem('installed'));
    switch (value) {
      case 'newest':
        installed.reverse();
        break;
      case 'oldest':
        break;
      case 'a-z':
        installed.sort();
        break;
      case 'z-a':
        installed.sort();
        installed.reverse();
        break;
      default:
        break;
    }

    this.setState({
      installed,
    });

    if (sendEvent) {
      variables.stats.postEvent('marketplace', 'Sort');
    }
  }

  updateCheck() {
    let updates = 0;
    this.state.installed.forEach(async (item) => {
      const data = await (
        await fetch(variables.constants.MARKETPLACE_URL + '/item/' + item.name)
      ).json();
      if (data.version !== item.version) {
        updates++;
      }
    });

    if (updates > 0) {
      toast(
        variables.getMessage('modals.main.addons.updates_available', {
          amount: updates,
        }),
      );
    } else {
      toast(variables.getMessage('modals.main.addons.no_updates'));
    }
  }

  componentDidMount() {
    this.sortAddons(localStorage.getItem('sortAddons'), false);
  }

  render() {
    const sideLoadBackendElements = () => (
      <>
        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ showFailed: false })}
          isOpen={this.state.showFailed}
          className="Modal resetmodal mainModal resetmodal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <SideloadFailedModal
            modalClose={() => this.setState({ showFailed: false })}
            reason={this.state.failedReason}
          />
        </Modal>
        <FileUpload
          id="file-input"
          type="settings"
          accept="application/json"
          loadFunction={(e) => this.installAddon(JSON.parse(e))}
        />
      </>
    );

    if (this.state.installed.length === 0) {
      return (
        <>
          <div className="flexTopMarketplace topAddons">
            <span className="mainTitle">{variables.getMessage('modals.main.navbar.addons')}</span>
            {sideLoadBackendElements()}
            <button
              className="sideload"
              onClick={() => document.getElementById('file-input').click()}
              ref={this.customDnd}
            >
              {variables.getMessage('modals.main.addons.sideload.title')}
              <MdCode />
            </button>
          </div>
          <div className="emptyItems">
            <div className="emptyNewMessage">
              <MdOutlineExtensionOff />
              <span className="title">
                {variables.getMessage('modals.main.addons.empty.title')}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.addons.empty.description')}
              </span>
            </div>
          </div>
        </>
      );
    }

    if (this.state.item.display_name) {
      return (
        <Item
          data={this.state.item}
          button={this.state.button}
          toggleFunction={() => this.toggle()}
        />
      );
    }

    return (
      <>
        <div className="flexTopMarketplace topAddons">
          <span className="mainTitle">{variables.getMessage('modals.main.addons.added')}</span>
          <div className="filter">
            {sideLoadBackendElements()}
            <div className="buttonSection">
              <button className="addToMue sideload updateCheck" onClick={() => this.updateCheck()}>
                <MdUpdate />
                {variables.getMessage('modals.main.addons.check_updates')}
              </button>
              <button
                className="sideload"
                onClick={() => document.getElementById('file-input').click()}
              >
                {variables.getMessage('modals.main.addons.sideload.title')}
                <MdCode />
              </button>
            </div>
          </div>
        </div>
        <Dropdown
          label={variables.getMessage('modals.main.addons.sort.title')}
          name="sortAddons"
          onChange={(value) => this.sortAddons(value)}
        >
          <option value="newest">{variables.getMessage('modals.main.addons.sort.newest')}</option>
          <option value="oldest">{variables.getMessage('modals.main.addons.sort.oldest')}</option>
          <option value="a-z">{variables.getMessage('modals.main.addons.sort.a_z')}</option>
          <option value="z-a">{variables.getMessage('modals.main.addons.sort.z_a')}</option>
        </Dropdown>
        <Items
          items={this.state.installed}
          filter=""
          toggleFunction={(input) => this.toggle('item', input)}
        />
      </>
    );
  }
}
