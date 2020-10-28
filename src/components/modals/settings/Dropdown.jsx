import React from 'react';

export default class Dropdown extends React.PureComponent {
  getLabel() {
    return this.props.label ? <label htmlFor={this.props.name}>{this.props.label}</label> : null;
  }

  render() {
    return (
      <React.Fragment>
        {this.getLabel()}
        <div className='dropdown' style={{ display: 'inline' }}>
          <select name={this.props.name} id={this.props.id} onChange={this.props.onChange}>
            {this.props.children}
          </select>
        </div>
      </React.Fragment>
    );
  }
}