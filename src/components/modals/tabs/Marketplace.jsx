import React from 'react';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { toast } from 'react-toastify';
import Item from '../marketplace/Item';
import MarketplaceFunctions from '../../../modules/helpers/marketplace';
import * as Constants from '../../../modules/constants';
import Items from '../marketplace/Items';

export default class Marketplace extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
        settings: [],
        photo_packs: [],
        quote_packs: [],
        see_more: [],
        see_more_type: '',
        current_data: {
            type: '',
            name: '',
            content: {}
        },
        button: '',
        featured: {},
        done: false,
        item_data: {
            name: 'Name',
            author: 'Author',
            description: 'Description',
            updated: '???',
            version: '1.0.0',
            icon: ''
        }
      }
      this.buttons = {
          uninstall: <button className='removeFromMue' onClick={() => this.manage('uninstall')}>{this.props.language.product.buttons.remove}</button>,
          install: <button className='addToMue' onClick={() => this.manage('install')}>{this.props.language.product.buttons.addtomue}</button>
      }
    }

  async toggle(type, type2, data) {
    switch (type) {
        case 'seemore':
            document.getElementById('marketplace').style.display = 'none';
            document.getElementById('seemore').style.display = 'block';
            this.setState({ see_more: this.state[type2], see_more_type: type2 });
            break;
        case 'item':
            let info;
            try { info = await (await fetch(`${Constants.MARKETPLACE_URL}/item/${type2}/${data}`)).json(); }
            catch (e) { return toast(this.props.toastLanguage.error); }

            this.setState({
                current_data: { type: type2, name: data, content: info },
                item_data: {
                    name: info.data.name,
                    author: info.data.author,
                    description: MarketplaceFunctions.urlParser(info.data.description.replace(/\n/g, '<br>')),
                    updated: info.updated,
                    version: info.data.version,
                    icon: info.data.screenshot_url
                }
            });

            let button = this.buttons.install;
            const installed = JSON.parse(localStorage.getItem('installed'));
            if (installed.some(item => item.name === data)) button = this.buttons.uninstall;
            this.setState({ button: button });

            document.getElementById('marketplace').style.display = 'none';
            document.getElementById('seemore').style.display = 'none';
            document.getElementById('item').style.display = 'block';
            break;
        default:
            document.getElementById('marketplace').style.display = 'block';
            document.getElementById('item').style.display = 'none';
            document.getElementById('seemore').style.display = 'none';
            break;
        }
   }

  async getItems() {
    const data = await (await fetch(Constants.MARKETPLACE_URL + '/all')).json();
    const featured = await (await fetch(Constants.MARKETPLACE_URL + '/featured')).json();
    this.setState({
        settings: data.data.settings,
        photo_packs: data.data.photo_packs,
        quote_packs: data.data.quote_packs,
        see_more: data.data.photo_packs,
        featured: featured.data,
        done: true
    });
  }

  manage(type) {
    switch (type) {
        case 'install': MarketplaceFunctions.install(this.state.current_data.type, this.state.current_data.content.data); break;
        case 'uninstall': MarketplaceFunctions.uninstall(this.state.current_data.content.data.name, this.state.current_data.type); break;
        default: break;
    }
    toast(this.props.toastLanguage[type + 'ed']);
    this.setState({
      button: (type === 'install') ? this.buttons.uninstall : this.buttons.install
    });
  }

  componentDidMount() {
    if (localStorage.getItem('animations') === 'true') document.getElementById('marketplace').classList.add('marketplaceanimation');
    if (navigator.onLine === false) return;
    this.getItems();
  }

  render() {
    const returnMessage = (msg) => {
        return (
            <div id='marketplace'>
              <div className='emptyMessage' style={{ 'marginTop': '20px', 'transform': 'translateY(80%)' }}>
                {msg}
              </div>
            </div>
        );
    }

    if (navigator.onLine === false) {
        return returnMessage(
            <React.Fragment>
                <WifiOffIcon/>
                <h1>{this.props.language.offline.title}</h1>
                <p className='description'>{this.props.language.offline.description}</p>
            </React.Fragment>
        );
    }

    if (this.state.done === false) return returnMessage(<h1>{this.props.updateLanguage.loading}</h1>);

    return (
        <React.Fragment>
            <div id='marketplace'>
                <div className='featured' style={{ 'backgroundColor': this.state.featured.colour }}>
                    <p>{this.state.featured.title}</p>
                    <h1>{this.state.featured.name}</h1>
                    <button className='addToMue' onClick={() => window.location.href = this.state.featured.buttonLink}>{this.state.featured.buttonText}</button>
                </div>
                <Items
                   title={this.props.language.photo_packs}
                   seeMoreTitle={this.props.language.see_more}
                   items={this.state.photo_packs.slice(0, 3)}
                   toggleFunction={(input) => this.toggle('item', 'photo_packs', input)}
                   seeMoreFunction={() => this.toggle('seemore', 'photo_packs')} />
                <Items
                   title={this.props.language.preset_settings}
                   seeMoreTitle={this.props.language.see_more}
                   items={this.state.settings.slice(0, 3)}
                   toggleFunction={(input) => this.toggle('item', 'settings', input)}
                   seeMoreFunction={() => this.toggle('seemore', 'settings')} />
                <Items
                   title={this.props.language.quote_packs}
                   seeMoreTitle={this.props.language.see_more}
                   items={this.state.quote_packs.slice(0, 3)}
                   toggleFunction={(input) => this.toggle('item', 'quote_packs', input)}
                   seeMoreFunction={() => this.toggle('seemore', 'quote_packs')} />
            </div>
            <Item
               button={this.state.button}
               data={this.state.item_data}
               content={this.state.current_data}
               function={() => this.toggle()} language={this.props.language.product} />
            <div id='seemore'>
                <ArrowBackIcon className='backArrow' onClick={() => this.toggle()} />
                <Items
                  title={this.props.language.see_more}
                  seeMoreTitle={this.props.language.see_more}
                  toggleFunction={(input) => this.toggle('item', this.state.see_more_type, input)}
                  items={this.state.see_more} />
            </div>
        </React.Fragment>
      );
    }
}