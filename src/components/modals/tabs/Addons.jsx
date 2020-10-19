import React from 'react';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { toast } from 'react-toastify';
import Item from '../marketplace/Item';
import MarketplaceFunctions from '../../../modules/marketplaceFunctions';

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
            this.setState({
                button: <button className='removeFromMue' onClick={() => this.uninstall()}>{this.props.marketplaceLanguage.product.buttons.remove}</button>
            });
            document.getElementById('marketplace').style.display = 'block';
            document.getElementById('item').style.display = 'none';
        }
    }

    uninstall() {
        let type, data = this.state.current_data.type;
        if (data === undefined) data = this.state.current_data.content.data.type;
        switch (data) {
            case 'photos':
                type = 'photo_packs';
                break;
            case 'quotes':
                type = 'quote_packs';
                break;
            default:
                type = this.state.current_data.type;
                break;
        }
        MarketplaceFunctions.uninstall(this.state.current_data.name, type);
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
            case 'quote_packs':
                if (input.quote_api) localStorage.setItem('quote_api', JSON.stringify(input.quote_api));
                localStorage.setItem('quote_packs', JSON.stringify(input.quotes));
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

    this.setState({ installed: JSON.parse(localStorage.getItem('installed')) });
  }

  render() {
     let content = <div className='items'>
           {this.state.installed.map((item) =>
                <div className='item' onClick={() => this.toggle('item', item.type, item.name)}>
                <img alt='icon' src={item.content.data.icon_url} />
                <div className='details'>
                    <h4>{item.content.data.name}</h4>
                    <p>{item.content.data.author}</p>
                </div>
            </div>)}
    </div>;

     if (this.state.installed.length === 0) {
         content = <div className='items'>
               <div className='emptyMessage'>
                    <LocalMallIcon />
                    <h1>{this.props.language.empty.title}</h1>
                    <p className='description'>{this.props.language.empty.description}</p>
                    <button className='goToMarket' onClick={this.props.openMarketplace}>{this.props.language.empty.button}</button>
              </div>
           </div>;
     }

    return (
       <div>
         <div id='marketplace'>
          <input id='file-input' type='file' name='name' className='hidden' />
          <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{this.props.language.sideload}</button>
          <h1>{this.props.language.added}</h1>
          {content}
         </div>
         <Item button={this.state.button} data={this.state.item_data} function={() => this.toggle()} language={this.props.marketplaceLanguage.product} />
       </div>
        );
    }
}
