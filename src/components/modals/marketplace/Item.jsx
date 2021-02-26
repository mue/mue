import React from 'react';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default function Item(props) {
    let warningHTML;
    try { // For some reason it breaks sometimes so we use try/catch
      if (props.content.content.data.quote_api) {
        warningHTML = (
          <div className='productInformation'>
            <ul>
              <li className='header'>{this.props.language.quote_warning.title}</li>
              <li id='updated'>{this.props.language.quote_warning.description}</li>
            </ul>
          </div>
        );
      }
    } catch (e) {
      // ignore
    }

    let iconsrc = 'https://external-content.duckduckgo.com/iu/?u=' + props.data.icon; // prevent console error
    if (!props.data.icon) {
      iconsrc = null;
    }

    return (
      <div id='item'>
        <br/>
        <ArrowBackIcon className='backArrow' onClick={props.function} />
        <br/>
        <h1>{props.data.name}</h1>
        {props.button}
        <br/><br/>
        <img alt='product' draggable={false} src={iconsrc} />
        <div className='informationContainer'>
          <div className='productInformation'>
            <h4>{props.language.information}</h4>
            <ul>
              <br/>
              <li className='header'>{props.language.last_updated}</li>
              <li>{props.data.updated}</li>
              <br/>
              <li className='header'>{props.language.version}</li>
              <li>{props.data.version}</li>
              <br/>
              <li className='header'>{props.language.author}</li>
             <li>{props.data.author}</li>
           </ul>
          </div>
          <div className='productInformation'>
            <ul>
              <li className='header'>{props.language.notice.title}</li>
              <li id='updated'>{props.language.notice.description}</li>
            </ul>
          </div>
          {warningHTML}
        </div>
        <br/>
        <h1>{props.language.overview}</h1>
        <p className='description' dangerouslySetInnerHTML={{__html: props.data.description}}></p>
      </div>
    );
}