import React from 'react';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { toast } from 'react-toastify';
import Item from '../marketplace/Item';
import Items from '../marketplace/Items';
import MarketplaceFunctions from '../../../modules/helpers/marketplace';

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
            button: ''
        }
        this.buttons = {
            uninstall: <button className='removeFromMue' onClick={() => this.uninstall()}>{this.props.marketplaceLanguage.product.buttons.remove}</button>,
        }
    }

    toggle(type, type2, data) {
        if (type === 'item') {
            const installed = JSON.parse(localStorage.getItem('installed'));
            const info = installed.find(i => i.name === data);
            this.setState({
                current_data: { type: type2, name: data, content: info },
                item_data: {
                    name: info.name,
                    author: info.author,
                    description: MarketplaceFunctions.urlParser(info.description.replace(/\n/g, '<br>')),
                    updated: 'Not Implemented',
                    version: info.version,
                    icon: info.screenshot_url
                }
            });

            document.getElementById('item').style.display = 'block';
            document.getElementById('marketplace').style.display = 'none';
         } else {
            document.getElementById('marketplace').style.display = 'block';
            document.getElementById('item').style.display = 'none';
        }
        this.setState({ button: this.buttons.uninstall });
    }

    uninstall() {
        let type, data = this.state.current_data.content.type;
        switch (data) {
            case 'photos': type = 'photo_packs'; break;
            case 'quotes': type = 'quote_packs'; break;
            default: type = this.state.current_data.type; break;
        }
        MarketplaceFunctions.uninstall(this.state.current_data.name, type);
        toast(this.props.toastLanguage.uninstalled);
        this.setState({
            button: '',
            installed: JSON.parse(localStorage.getItem('installed'))
        });
    }

    install(input) {
        MarketplaceFunctions.install(input.type, input, true);
        toast(this.props.toastLanguage.installed);
        this.setState({
            button: this.buttons.uninstall,
            installed: JSON.parse(localStorage.getItem('installed'))
        });
    }

  componentDidMount() {
    document.getElementById('file-input').onchange = (e) => {
        const reader = new FileReader();
        reader.readAsText(e.target.files[0], 'UTF-8');
        reader.onload = (readerEvent) => this.install(JSON.parse(readerEvent.target.result));
    };

    this.setState({ installed: JSON.parse(localStorage.getItem('installed')) });
  }

  render() {
    let content = <Items items={this.state.installed} toggleFunction={(input) => this.toggle('item', 'addon', input)} />

    if (this.state.installed.length === 0) {
         content = (
           <div className='items'>
            <div className='emptyMessage'>
                 <LocalMallIcon/>
                 <h1>{this.props.language.empty.title}</h1>
                 <p className='description'>{this.props.language.empty.description}</p>
                 <button className='goToMarket' onClick={this.props.openMarketplace}>{this.props.language.empty.button}</button>
           </div>
          </div>
        );
    }

    return (
       <div>
         <div id='marketplace'>
          <input id='file-input' type='file' name='name' className='hidden' accept='application/json' />
          <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{this.props.language.sideload}</button>
          <h1>{this.props.language.added}</h1>
          {content}
         </div>
         <Item button={this.state.button} data={this.state.item_data} function={() => this.toggle()} language={this.props.marketplaceLanguage.product} />
       </div>
        );
    }
}
