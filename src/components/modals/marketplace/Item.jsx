import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default class Item extends React.PureComponent {
  render() {
    return (
      <div id='item'>
      <br/>
      <ArrowBackIcon className='backArrow' onClick={this.props.function} />
      <br/>
      <h1>{this.props.data.name}</h1>
      {this.props.button}
      <br/><br/>
      <img alt="product" draggable={false} src={'https://external-content.duckduckgo.com/iu/?u=' + this.props.data.icon} />
      <div className="informationContainer">
      <div className="productInformation">
          <h4>{this.props.language.information}</h4>
          <ul>
              <br/>
              <li className="header">{this.props.language.last_updated}</li>
              <li>{this.props.data.updated}</li>
              <br/>
              <li className="header">{this.props.language.version}</li>
              <li>{this.props.data.version}</li>
              <br/>
              <li className="header">{this.props.language.author}</li>
              <li>{this.props.data.author}</li>
          </ul>
      </div>
      <div className="productInformation">
          <ul>
              <li className="header">{this.props.language.notice.title}</li>
              <li id='updated'>{this.props.language.notice.description}</li>
          </ul>
      </div>
      </div>
      <br/>
      <h1>{this.props.language.overview}</h1>
      <p className="description" dangerouslySetInnerHTML={{__html: this.props.data.description}}></p>
    </div>
    );
  }
}