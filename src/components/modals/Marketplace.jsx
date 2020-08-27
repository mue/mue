import React from 'react';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { toast } from 'react-toastify';
import Item from './marketplace/Item';
import MarketplaceFunctions from '../../modules/marketplaceFunctions';
import * as Constants from '../../modules/constants';
import Items from './marketplace/Items';

export default class Marketplace extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            themes: [],
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

        this.offlineHTML = <div className='content'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1>{this.props.modalLanguage.title}</h1>
        <div className="tab">
            <button className="tablinks" id="active">{this.props.modalLanguage.marketplace}</button>
            <button className="tablinks" onClick={this.props.openAddons}>{this.props.modalLanguage.addons}</button>
            <button className="tablinks"
                onClick={this.props.openSettings}>{this.props.modalLanguage.settings}</button>
        </div>
        <div id='marketplace'>
            <div className="emptyMessage" style={{"marginTop": "20px", "transform": "translateY(80%)"}}>
                <WifiOffIcon />
                <h1>{this.props.language.offline.title}</h1>
                <p className="description">{this.props.language.offline.description}</p>
            </div>
        </div>
        </div>;
    }

    async toggle(type, type2, data) {
        if (type === 'seemore') {
            document.getElementById('marketplace').style.display = 'none';
            document.getElementById('seemore').style.display = 'block';
            return this.setState({
                see_more: this.state[type2],
                see_more_type: type2
            });
        }

        if (type === 'item') {
            let info;
            try {
                info = await fetch(`${Constants.MARKETPLACE_URL}/item/${type2}/${data}`);
                info = await info.json();
            } catch (e) {
                return toast(this.props.toastLanguage.error);
            }

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
            document.getElementById('marketplace').style.display = 'none';
            document.getElementById('seemore').style.display = 'none';
            document.getElementById('item').style.display = 'block';

            let button = <button className="addToMue" onClick={() => this.install()}>{this.props.language.product.buttons.addtomue}</button>;
            let installed = JSON.parse(localStorage.getItem('installed'));
            if (installed.some(item => item.name === data)) button = <button className="removeFromMue" onClick={() => this.uninstall()}>{this.props.language.product.buttons.remove}</button>;
            this.setState({ button: button });
        } else {
            document.getElementById('marketplace').style.display = 'block';
            document.getElementById('item').style.display = 'none';
            document.getElementById('seemore').style.display = 'none';
        }
   }

    async getItems() {
        let data = await fetch(Constants.MARKETPLACE_URL + '/all');
        data = await data.json();
        let data2 = await fetch(Constants.MARKETPLACE_URL + '/featured');
        data2 = await data2.json();
        this.setState({
            themes: data.data.themes,
            settings: data.data.settings,
            photo_packs: data.data.photo_packs,
            quote_packs: data.data.quote_packs,
            see_more: data.data.photo_packs,
            featured: data2.data,
            done: true
        });
    }

    async install() {
        let installed = JSON.parse(localStorage.getItem('installed'));
        let button;

        const installStuff = () => {
           installed.push(this.state.current_data);
           localStorage.setItem('installed', JSON.stringify(installed));
           toast(this.props.toastLanguage.installed);
           button = <button className="removeFromMue" onClick={() => this.uninstall()}>{this.props.language.product.buttons.remove}</button>;
           this.setState({ button: button });
        }

        switch (this.state.current_data.type) {
            case 'settings':
                localStorage.removeItem('backup_settings');
                let oldSettings = [];
                for (const key of Object.keys(localStorage)) oldSettings.push({name: key, value: localStorage.getItem(key)});
                localStorage.setItem('backup_settings', JSON.stringify(oldSettings));
                this.state.current_data.content.data.settings.forEach(element => localStorage.setItem(element.name, element.value));
                installStuff();
                break;
            case 'photo_packs':
                localStorage.setItem('photo_packs', JSON.stringify(this.state.current_data.content.data.photos));
                installStuff();
                break;
            case 'theme':
                localStorage.setItem('theme', this.state.current_data.content.data.theme);
                installStuff();
                break;
            case 'quote_packs':
                localStorage.setItem('quote_packs', JSON.stringify(this.state.current_data.content.data.quotes));
                installStuff();
                break;
            default:
               console.log('invalid');
        }
    }

    uninstall() {
        MarketplaceFunctions.uninstall(this.state.current_data.name, this.state.current_data.type);
        toast(this.props.toastLanguage.removed);
        this.setState({
            button: <button className="addToMue" onClick={() => this.install()}>{this.props.language.product.buttons.addtomue}</button>
        });
    }

    componentDidMount() {
      document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
      document.getElementById('center').classList.toggle('backgroundEffects');
      if (navigator.onLine === false) return;
      this.getItems();
    }

   componentWillUnmount() {
      document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
      document.getElementById('center').classList.toggle('backgroundEffects');
   }

  render() {
    if (navigator.onLine === false || this.state.done === false) return this.offlineHTML;

    return <div className='content'>
             <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
             <h1>{this.props.modalLanguage.title}</h1>
             <div className="tab">
                 <button className="tablinks" id="active">{this.props.modalLanguage.marketplace}</button>
                 <button className="tablinks" onClick={this.props.openAddons}>{this.props.modalLanguage.addons}</button>
                 <button className="tablinks"
                     onClick={this.props.openSettings}>{this.props.modalLanguage.settings}</button>
             </div>
             <div id='marketplace'>
                 <div className="featured" style={{backgroundColor: this.state.featured.colour}}>
                     <p>{this.state.featured.title}</p>
                     <h1>{this.state.featured.name}</h1>
                     <button className="addToMue" onClick={() => window.location.href = this.state.featured.buttonLink}>{this.state.featured.buttonText}</button>
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
                 <Items
                   title={this.props.language.themes}
                   seeMoreTitle={this.props.language.see_more}
                   items={this.state.themes.slice(0, 3)}
                   toggleFunction={(input) => this.toggle('item', 'theme', input)}
                   seeMoreFunction={() => this.toggle('seemore', 'themes')} />
             </div>
             <Item button={this.state.button} data={this.state.item_data} function={()=> this.toggle()} language={this.props.language.product} />
             <div id='seemore'>
                <ArrowBackIcon className='backArrow' onClick={() => this.toggle()} />
                <Items
                  title={this.props.language.see_more}
                  seeMoreTitle={this.props.language.see_more}
                  toggleFunction={(input) => this.toggle('item', this.state.see_more_type, input)}
                  items={this.state.see_more}
                />
             </div>
            </div>;
    }
}