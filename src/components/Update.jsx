import React from 'react';

export default class Update extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      title: 'Loading...',
      date: '',
      content: 'Loading...'
    };
 }

 async getUpdate() {
  const enabled = localStorage.getItem('offlineMode');
  if (enabled === 'true') return this.setState({
    title: 'Offline',
    content: 'Cannot get update logs while in offline mode'
  });

  try { // First we try and get a quote from the API...
    let data = await fetch('https://api.muetab.xyz/getUpdate');
    data = await data.json();
    this.setState({
      title: data.title,
      content: data.content
    });
  } catch (e) {
    this.setState({
      title: 'Error',
      content: 'Could not connect to the server!'
    });
  }
 }

 componentDidMount() {
   this.getUpdate();
 }

  render() {
    return <div className="content">
        <span className="closeModal" onClick={this.props.modalClose}>&times;</span>
        <h1 dangerouslySetInnerHTML={{__html: this.state.title}}></h1>
        <p dangerouslySetInnerHTML={{__html: this.state.content}}></p>
      </div>;
    }
}