import React from 'react';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { toast } from 'react-toastify';
import Item from './marketplace/Item';
import MarketplaceFunctions from '../../modules/marketplaceFunctions';

export default class Addons extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            installed: [],
            current_data: {
                type: '',
                name: '',
                content: {}
            },
            item_data: {
                name: 'Name',
                author: 'Author',
                description: 'Description',
                updated: '???',
                version: '1.0.0',
                icon: ''
            },
            button: <button className='removeFromMue' onClick={() => this.uninstall()}>{this.props.marketplaceLanguage.product.buttons.remove}</button>
        }
    }

    toggle(type, type2, data) {
        if (type === 'item') {
            let installed = JSON.parse(localStorage.getItem('installed'));
            let info = installed.find(i => i.name === data).content;
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

            document.getElementById('item').style.display = 'block';
            document.getElementById('marketplace').style.display = 'none';
         } else {
            document.getElementById('marketplace').style.display = 'block';
            document.getElementById('item').style.display = 'none';
        }
    }

    uninstall() {
        MarketplaceFunctions.uninstall(this.state.current_data.name, this.state.current_data.type);
        toast(this.props.toastLanguage.removed);
        this.setState({
            button: '',
            installed: JSON.parse(localStorage.getItem('installed'))
        });
    }

    install(input) {
        let installed = JSON.parse(localStorage.getItem('installed'));
        let button;

        const installStuff = () => {
           installed.push({
                content: {
                   updated: 'Unpublished',
                   data: input
                }
           });
           localStorage.setItem('installed', JSON.stringify(installed));
           toast(this.props.toastLanguage.installed);
           button = <button className='removeFromMue' onClick={() => this.uninstall()}>{this.props.marketplaceLanguage.product.buttons.remove}</button>;
           this.setState({
               button: button,
               installed: JSON.parse(localStorage.getItem('installed'))
            });
        }

        switch (input.type) {
            case 'settings':
                localStorage.removeItem('backup_settings');
                let oldSettings = [];
                for (const key of Object.keys(localStorage)) oldSettings.push({name: key, value: localStorage.getItem(key)});
                localStorage.setItem('backup_settings', JSON.stringify(oldSettings));
                input.settings.forEach(element => localStorage.setItem(element.name, element.value));
                installStuff();
                break;
            case 'photos':
                localStorage.setItem('photo_packs', JSON.stringify(input.photos));
                installStuff();
                break;
            case 'theme':
                localStorage.setItem('theme', input.theme);
                installStuff();
                break;
            case 'quotes':
                if (this.state.current_data.content.data.quote_api) localStorage.setItem('quote_api', JSON.stringify(this.state.current_data.content.data.quote_api));
                localStorage.setItem('quote_packs', JSON.stringify(this.state.current_data.content.data.quotes));
                installStuff();
                break;
            default:
               break;
        }
    }

  componentDidMount() {
    document.getElementById('file-input').onchange = (e) => {
        const file = e.target.files[0];
        if (file.type !== 'application/json') return console.error(`expected json, got ${file.type}`);

        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = (readerEvent) => {
          const content = JSON.parse(readerEvent.target.result);
          this.install(content);
        };
    };

    document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
    document.getElementById('center').classList.toggle('backgroundEffects');
    this.setState({ installed: JSON.parse(localStorage.getItem('installed')) });
  }

  componentWillUnmount() {
    document.getElementById('backgroundImage').classList.toggle('backgroundEffects');
    document.getElementById('center').classList.toggle('backgroundEffects');
  }

  render() {
     if (this.state.installed.length === 0) {
         return <div className='content'>
         <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
         <h1>{this.props.modalLanguage.title}</h1>
             <div className='tab'>
               <button className='tablinks' onClick={this.props.openMarketplace}>{this.props.modalLanguage.marketplace}</button>
               <button className='tablinks' id='active'>{this.props.modalLanguage.addons}</button>
               <button className='tablinks' onClick={this.props.openSettings}>{this.props.modalLanguage.settings}</button>
            </div>
         <div id='marketplace'>
         <input id='file-input' type='file' name='name' className='hidden' />
         <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>Sideload</button>
           <h1>{this.props.language.added}</h1>
           <div className='items'>
               <div className='emptyMessage'>
                    <LocalMallIcon />
                    <h1>{this.props.language.empty.title}</h1>
                    <p className='description'>{this.props.language.empty.description}</p>
                    <button className='goToMarket' onClick={this.props.openMarketplace}>{this.props.language.empty.button}</button>
              </div>
           </div>
         </div>
        </div>;
     }

    return <div className='content'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1>{this.props.modalLanguage.title}</h1>
             <div className='tab'>
               <button className='tablinks' onClick={this.props.openMarketplace}>{this.props.modalLanguage.marketplace}</button>
               <button className='tablinks' id='active'>{this.props.modalLanguage.addons}</button>
               <button className='tablinks' onClick={this.props.openSettings}>{this.props.modalLanguage.settings}</button>
            </div>
        <div id='marketplace'>
        <input id='file-input' type='file' name='name' className='hidden' />
        <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>Sideload</button>
        <h1>{this.props.language.added}</h1>
          <div className='items'>
              {this.state.installed.map((item) =>
                   <div className='item' onClick={() => this.toggle('item', item.type, item.name)}>
                   <img alt='icon' src={item.content.data.icon_url} />
                   <div className='details'>
                       <h4>{item.content.data.name}</h4>
                       <p>{item.content.data.author}</p>
                   </div>
               </div>)}
          </div>
        </div>
        <Item button={this.state.button} data={this.state.item_data} function={() => this.toggle()} language={this.props.marketplaceLanguage.product} />
    </div>;
    }
}
