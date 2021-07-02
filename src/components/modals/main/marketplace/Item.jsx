import React from 'react';

import Modal from 'react-modal';

import Lightbox from './Lightbox';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default class Item extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showLightbox: false
    };
  }

  render() {
    const language = window.language.modals.main.marketplace.product;

    if (!this.props.data.display_name) {
      return null;
    }

    let warningHTML;
    if (this.props.data.quote_api) {
      warningHTML = (
        <div className='productInformation'>
          <ul>
            <li className='header'>{language.quote_warning.title}</li>
            <li id='updated'>{language.quote_warning.description}</li>
          </ul>
        </div>
      );
    }
  
    // prevent console error
    let iconsrc = window.constants.DDG_IMAGE_PROXY + this.props.data.icon;
    if (!this.props.data.icon) {
      iconsrc = null;
    }
  
    return (
      <div id='item'>
        <br/>
        <ArrowBackIcon className='backArrow' onClick={this.props.toggleFunction}/>
        <br/>
        <h1>{this.props.data.display_name}</h1>
        <br/>
        {this.props.button}
        <br/>
        {iconsrc ? <img alt='product' draggable='false' src={iconsrc} onClick={() => this.setState({ showLightbox: true })}/> : null}
        <div className='informationContainer'>
          <h1 className='overview'>{language.overview}</h1>
          <p className='description' dangerouslySetInnerHTML={{ __html: this.props.data.description }}></p>
            <div className='productInformation'>
              <ul>
                {/* <li className='header'>{language.last_updated}</li>
                <li>{this.props.data.updated}</li>
                <br/>*/}
                <li className='header'>{language.version}</li>
                <li>{this.props.data.version}</li>
                <br/>
                <li className='header'>{language.author}</li>
               <li>{this.props.data.author}</li>
             </ul>
            </div>
            <br/>
            {warningHTML} 
        </div>
        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ showLightbox: false })} isOpen={this.state.showLightbox} className='Modal lightboxmodal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <Lightbox modalClose={() => this.setState({ showLightbox: false })} img={iconsrc}/>
        </Modal>
      </div>
    );
  }
}
