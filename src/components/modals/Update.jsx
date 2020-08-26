import React from 'react';
import * as Constants from '../../modules/constants';

export default class Update extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      title: this.props.language.title,
      date: '???',
      content: this.props.language.title,
      url: '',
      author: 'Mue'
    };
 }

 async getUpdate() {
  if (localStorage.getItem('offlineMode') === 'true') return this.setState({
    title: this.props.language.offline.title,
    content: this.props.language.offline.description
  });

  try { // Get update log from the API
    let data = await fetch(Constants.API_URL + '/getUpdate');
    data = await data.json();
    this.setState({
      title: data.title,
      content: data.content,
      date: data.published,
      image: data.image,
      url: data.url,
      author: data.author
    });
  } catch (e) { // If it fails, we send an error
    this.setState({
      title: this.props.language.error.title,
      content: this.props.language.error.description
    });
  }
 }

 componentDidMount() {
   localStorage.setItem('viewedUpdate', true);
   this.getUpdate();
 }

  render() {
    return <div className='updateContent'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1 style={{ 'marginBottom':'-10px' }} dangerouslySetInnerHTML={{__html: this.state.title}}></h1>
        <h5 style={{ 'lineHeight':'0px' }}> By {this.state.author} • {this.state.date}</h5>
        <img src={this.state.image} alt='Update'></img>
        <p dangerouslySetInnerHTML={{__html: this.state.content + `<br/><p>Read on the blog here: <a href='${this.state.url}'>${this.state.url}</a></p>`}}></p>
      </div>;
    }
}