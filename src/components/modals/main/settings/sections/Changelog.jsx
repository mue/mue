import React from 'react';

import Modal from 'react-modal';

import Lightbox from '../../marketplace/Lightbox';

import WifiOffIcon from '@material-ui/icons/WifiOff';

export default class Changelog extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      title: null,
      showLightbox: false,
      lightboxImg: null
    };
    this.language = window.language.modals.update;
    this.controller = new AbortController();
  }

  async getUpdate() {
    const data = await (await fetch(window.constants.BLOG_POST + '/index.json', { signal: this.controller.signal })).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    let date = new Date(data.date);
    date = date.toLocaleDateString(window.languagecode.replace('_', '-'), { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    this.setState({
      title: data.title,
      date: date,
      image: data.featured_image || null,
      author: 'By ' + data.authors.join(', '),
      html: data.html
    });

    // lightbox etc
    const content = document.querySelector('.tab-content');
    const images = content.getElementsByTagName('img');
    const links = content.getElementsByTagName('a');

    for (const img of images) {
      img.draggable = false;
      img.onclick = () => {
        this.setState({
          showLightbox: true,
          lightboxImg: img.src
        });
      };
    }

    for (let link = 0; link < links.length; link++) {
      links[link].target = '_blank';
      links[link].rel = 'noopener noreferrer';
    }
  }
  
  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }
  
    this.getUpdate();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    const errorMessage = (msg) => {
      return (
        <div className='emptyitems'>
          <div className='emptyMessage'>
            {msg}
          </div>
        </div>
      );
    };

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      const language = window.language.modals.main.marketplace;
    
      return errorMessage(<>
        <WifiOffIcon/>
        <h1>{language.offline.title}</h1>
        <p className='description'>{language.offline.description}</p>
      </>);
    }
  
    if (!this.state.title) {
      return errorMessage(<h1>{window.language.modals.main.loading}</h1>);
    }

    return (
      <div className='changelogtab'>
        <h1 style={{ 'marginBottom': '-10px' }}>{this.state.title}</h1>
        <h5 style={{ 'lineHeight': '0px' }}>{this.state.author} • {this.state.date}</h5>
        {this.state.image ? <img draggable='false' src={this.state.image} alt={window.language.modals.update.title} className='updateimage'/> : null}
        <div className='updatechangelog' dangerouslySetInnerHTML={{ __html: this.state.html }}/>
        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ showLightbox: false })} isOpen={this.state.showLightbox} className='Modal lightboxmodal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <Lightbox modalClose={() => this.setState({ showLightbox: false })} img={this.state.lightboxImg}/>
        </Modal>
      </div>
    );
  }
}
