import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdLocalMall } from 'react-icons/md';
import { toast } from 'react-toastify';

import Item from '../Item';
import Items from '../Items';
import Dropdown from '../../settings/Dropdown';

import { uninstall, urlParser } from 'modules/helpers/marketplace';

export default class Added extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      installed: JSON.parse(localStorage.getItem('installed')),
      item: {},
      button: '',
    };
    this.buttons = {
      uninstall: (
        <button className="removeFromMue" onClick={() => this.uninstall()}>
          {this.getMessage('modals.main.marketplace.product.buttons.remove')}
        </button>
      ),
    };
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

    toast(this.getMessage('toasts.uninstalled'));

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
        this.getMessage('modals.main.addons.updates_available', {
          amount: updates,
        }),
      );
    } else {
      toast(this.getMessage('modals.main.addons.no_updates'));
    }
  }

  componentDidMount() {
    this.sortAddons(localStorage.getItem('sortAddons'), false);
  }

  render() {
    if (this.state.installed.length === 0) {
      return (
        <div className="emptyItems">
          <div className="emptyMessage">
            <MdLocalMall />
            <span className="title">{this.getMessage('modals.main.addons.empty.title')}</span>
            <span className="subtitle">
              {this.getMessage('modals.main.addons.empty.description')}
            </span>
          </div>
        </div>
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
        <Dropdown
          label={this.getMessage('modals.main.addons.sort.title')}
          name="sortAddons"
          onChange={(value) => this.sortAddons(value)}
        >
          <option value="newest">{this.getMessage('modals.main.addons.sort.newest')}</option>
          <option value="oldest">{this.getMessage('modals.main.addons.sort.oldest')}</option>
          <option value="a-z">{this.getMessage('modals.main.addons.sort.a_z')}</option>
          <option value="z-a">{this.getMessage('modals.main.addons.sort.z_a')}</option>
        </Dropdown>
        <button className="addToMue sideload updateCheck" onClick={() => this.updateCheck()}>
          {this.getMessage('modals.main.addons.check_updates')}
        </button>
        <br />
        <Items
          items={this.state.installed}
          toggleFunction={(input) => this.toggle('item', input)}
        />
      </>
    );
  }
}
