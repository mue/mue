import React from 'react';

export default class Update extends React.Component {
  render() {
    return <div className="content">
              <span className="closeModal" onClick={this.props.modalClose}>&times;</span>
              <h1>Update</h1>
      <p>Edit different components to make Mue your new tab.</p>
    </div>;
  }
}