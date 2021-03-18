import React from 'react';

import * as Constants from '../../../../modules/constants';

export default class Changelog extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      title: this.props.language.title,
      date: null,
      content: this.props.language.title,
      html: this.props.language.loading,
      image: null
    };
  }

  async getUpdate() {
    const data = await (await fetch(Constants.API_URL + '/getUpdate')).json();
  
    if (data.statusCode === 500 || data.title === null) {
      const supportText = `<br/><p>${this.props.language.contact_support}: <a target='_blank' class='modalLink' href='https://muetab.com/contact'>https://muetab.com/contact</a></p>`;
      return this.setState({
        title: this.props.language.error.title,
        html: this.props.language.error.description + supportText
      });
    }
  
    this.setState({
      title: data.title,
      date: data.published,
      image: data.image || null,
      author: data.author,
      html: data.content
    });
   }
  
   componentDidMount() {
    if (localStorage.getItem('offlineMode') === 'true') {
      return this.setState({
        title: this.props.language.offline.title,
        html: this.props.language.offline.description
      });
    }
  
    this.getUpdate();
   }

  render() {
    return (
      <div>
        <h1 style={{ 'marginBottom': '-10px' }}>{this.state.title}</h1>
        <h5 style={{ 'lineHeight': '0px' }}>{this.state.date}</h5>
        {this.state.image ? <img draggable='false' src={this.state.image} alt='Update'></img> : null}
        <p dangerouslySetInnerHTML={{ __html: this.state.html }}></p>
      </div>
    );
  }
}
