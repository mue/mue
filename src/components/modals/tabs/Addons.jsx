import React from 'react';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { toast } from 'react-toastify';
import Item from '../marketplace/Item';
import Items from '../marketplace/Items';
import FileUpload from '../settings/FileUpload';
import MarketplaceFunctions from '../../../modules/helpers/marketplace';

export default class Addons extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            installed: JSON.parse(localStorage.getItem('installed')),
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
            uninstall: <button className='removeFromMue' onClick={() => this.manage('uninstall')}>{this.props.marketplaceLanguage.product.buttons.remove}</button>,
        }
    }

    toggle(type, type2, data) {
        if (type === 'item') {
            const installed = JSON.parse(localStorage.getItem('installed'));
            const info = installed.find(i => i.name === data);

            this.setState({
                current_data: { 
                    type: type2,
                    name: data,
                    content: info 
                },
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
        this.setState({ 
            button: this.buttons.uninstall 
        });
    }

  manage(type, input) {
    switch (type) {
        case 'install': 
          MarketplaceFunctions.install(input.type, input, true); 
          break;
        case 'uninstall': 
          MarketplaceFunctions.uninstall(this.state.current_data.name, this.state.current_data.content.type); 
          break;
        default: 
          break;
    }

    toast(this.props.toastLanguage[type + 'ed']);

    let button = '';
    if (type === 'install'){
        button = this.buttons.uninstall;
    }

    this.setState({ 
        button: button, 
        installed: JSON.parse(localStorage.getItem('installed')) 
    });
  }

  componentDidMount() {
    if (localStorage.getItem('animations') === 'true') {
        document.getElementById('marketplace').classList.add('marketplaceanimation');
    }
  }

  render() {
    let content = <Items items={this.state.installed} toggleFunction={(input) => this.toggle('item', 'addon', input)} />;

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
       <React.Fragment>
        <div id='marketplace'>
          <FileUpload id='file-input' accept='application/json' loadFunction={(e) => this.manage('install', JSON.parse(e.target.result))} />
          <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{this.props.language.sideload}</button>
          <h1>{this.props.language.added}</h1>
          {content}
        </div>
        <Item button={this.state.button} data={this.state.item_data} function={() => this.toggle()} language={this.props.marketplaceLanguage.product} />
       </React.Fragment>
      );
    }
}