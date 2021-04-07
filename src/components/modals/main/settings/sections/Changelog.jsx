import React from 'react';

export default class Changelog extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      title: window.language.modals.update.title,
      date: null,
      content: window.language.modals.update.title,
      html: window.language.modals.main.loading,
      image: null
    };
    this.language = window.language.modals.update;
  }

  async getUpdate() {
    const data = await (await fetch(window.constants.API_URL + '/getUpdate')).json();
  
    if (data.statusCode === 500 || data.title === null) {
      const supportText = `<br/><p>${this.language.contact_support}: <a target='_blank' class='modalLink' style='padding-left: 0px' href='https://muetab.com/contact'>https://muetab.com/contact</a></p>`;
      return this.setState({
        title: this.language.error.title,
        html: this.language.error.description + supportText
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
        title: this.language.offline.title,
        html: this.language.offline.description
      });
    }
  
    this.getUpdate();
   }

  render() {
    return (
      <>
        <h1 style={{ 'marginBottom': '-10px' }}>{this.state.title}</h1>
        <h5 style={{ 'lineHeight': '0px' }}>{this.state.date}</h5>
        {this.state.image ? <img draggable='false' src={this.state.image} alt='Update'></img> : null}
        <p dangerouslySetInnerHTML={{ __html: this.state.html }}></p>
      </>
    );
  }
}
