import React from 'react';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default function Item(props) {
  const language = window.language.modals.main.marketplace.product;

  let warningHTML;
  // For some reason it breaks sometimes so we use try/catch
  try {
    if (props.content.content.data.quote_api) {
      warningHTML = (
        <div className='productInformation'>
          <ul>
            <li className='header'>{language.quote_warning.title}</li>
            <li id='updated'>{language.quote_warning.description}</li>
          </ul>
        </div>
      );
    }
  } catch (e) {
    // ignore
  }

  // prevent console error
  let iconsrc = 'https://external-content.duckduckgo.com/iu/?u=' + props.data.icon;
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
          <h4>{language.information}</h4>
          <ul>
            <br/>
            <li className='header'>{language.last_updated}</li>
            <li>{props.data.updated}</li>
            <br/>
            <li className='header'>{language.version}</li>
            <li>{props.data.version}</li>
            <br/>
            <li className='header'>{language.author}</li>
           <li>{props.data.author}</li>
         </ul>
        </div>
        <div className='productInformation'>
          <ul>
            <li className='header'>{language.notice.title}</li>
            <li id='updated'>{language.notice.description}</li>
          </ul>
        </div>
        {warningHTML}
      </div>
      <br/>
      <h1>{language.overview}</h1>
      <p className='description' dangerouslySetInnerHTML={{__html: props.data.description}}></p>
    </div>
  );
}
