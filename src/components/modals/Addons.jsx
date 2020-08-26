import React from 'react';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { toast } from 'react-toastify';
import dtf from '@eartharoid/dtf';
import Item from './marketplace/Item';
import MarketplaceFunctions from '../../modules/marketplaceFunctions';

export default class Addons extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            installed: [],
            item_data: {
                name: 'Name',
                author: 'Author',
                description: 'Description',
                updated: '???',
                version: '1.0.0',
                icon: ''
            }
        }
    }

    async toggle(type, type2, data) {
        if (type === 'item') {
            let installed = JSON.parse(localStorage.getItem('installed'));
            let info = installed.find(i => i.name === data).content;
            this.setState({
                current_data: { type: type2, name: data, content: info },
                item_data: {
                    name: info.data.name,
                    author: info.data.author,
                    description: MarketplaceFunctions.urlParser(info.data.description.replace(/\n/g, '<br>')),
                    updated: dtf('n_D MMM YYYY', info.updated, 'en-GB'),
                    version: info.data.version,
                    icon: info.data.screenshot_url
                }
             });
            document.getElementById('marketplace').style.display = 'none';
            document.getElementById('item').style.display = 'block';
         } else {
            document.getElementById('marketplace').style.display = 'block';
            document.getElementById('item').style.display = 'none';
        }
    }

    uninstall() {
        let installed = JSON.parse(localStorage.getItem('installed'));

        const uninstallStuff = () => {
            for (let i = 0; i < installed.length; i++) {
                if (installed[i].name === this.state.current_data.name) {
                    installed.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem('installed', JSON.stringify(installed));
            toast(this.props.toastLanguage.removed);
            this.toggle();
            this.componentDidMount();
        }

        switch (this.state.current_data.type) {
            case 'settings':
                let oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
                localStorage.clear();
                oldSettings.forEach(item => localStorage.setItem(item.name, item.value));
                uninstallStuff();
                break;
            default:
                try {
                    localStorage.removeItem(this.state.current_data.type);
                    uninstallStuff();
                } catch (e) {
                    console.log('invalid');
                }
        }
    }

  componentDidMount() {
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
             <div className="tab">
               <button className="tablinks" onClick={this.props.openMarketplace}>{this.props.modalLanguage.marketplace}</button>
               <button className="tablinks" id="active">{this.props.modalLanguage.addons}</button>
               <button className="tablinks" onClick={this.props.openSettings}>{this.props.modalLanguage.settings}</button>
            </div>
         <div id='marketplace'>
         { /*<input id='file-input' type='file' name='name' className='hidden' />
        <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>Sideload</button> */}
           <h1>{this.props.language.added}</h1>
           <div className="items">
               <div className="emptyMessage">
                    <LocalMallIcon />
                    <h1>{this.props.language.empty.title}</h1>
                    <p className="description">{this.props.language.empty.description}</p>
                    <button className="goToMarket" onClick={this.props.openMarketplace}>{this.props.language.empty.button}</button>
              </div>
           </div>
         </div>
         </div>
     }

    return <div className='content'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1>{this.props.modalLanguage.title}</h1>
             <div className="tab">
               <button className="tablinks" onClick={this.props.openMarketplace}>{this.props.modalLanguage.marketplace}</button>
               <button className="tablinks" id="active">{this.props.modalLanguage.addons}</button>
               <button className="tablinks" onClick={this.props.openSettings}>{this.props.modalLanguage.settings}</button>
            </div>
        <div id='marketplace'>
       { /*<input id='file-input' type='file' name='name' className='hidden' />
        <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>Sideload</button> */}
        <h1>{this.props.language.added}</h1>
          <div className="items">
              {this.state.installed.map((item) =>
                   <div className="item" onClick={()=> this.toggle('item', item.type, item.name)}>
                   <img alt="icon" src={item.content.data.icon_url} />
                   <div className="details">
                       <h4>{item.content.data.name}</h4>
                       <p>{item.content.data.author}</p>
                   </div>
               </div>)}
          </div>
        </div>
        <Item button={<button className="removeFromMue" onClick={() => this.uninstall()}>{this.props.language.product.buttons.remove}</button>} data={this.state.item_data} function={()=> this.toggle()} language={this.props.language.product} />
    </div>;
    }
}