import React from 'react';
import * as Constants from '../modules/constants';

export default class Update extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      title: this.props.language.title,
      date: '21/07/2020',
      content: this.props.language.title
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
      content: data.content
    });
  } catch (e) { // If it fails, we send an error
    this.setState({
      title: this.props.language.error.title,
      content: this.props.language.error.description
    });
  }
 }

 componentDidMount() {
   this.getUpdate();
 }

  render() {
    return <div className='content'>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <h1 style={{ 'marginBottom':'-10px' }} dangerouslySetInnerHTML={{__html: this.state.title}}></h1>
        <h5 style={{ 'lineHeight':'0px' }}> By Mue • <span dangerouslySetInnerHTML={{__html: this.state.date}}></span></h5>
        <p style={{ 'padding': '0px 20px 0px 20px' }} dangerouslySetInnerHTML={{__html: this.state.content}}></p>
      </div>;
    }
}