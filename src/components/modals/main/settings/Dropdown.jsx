import React from 'react';

export default class Dropdown extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      value: localStorage.getItem(this.props.name) || ''
    };
  }

  getLabel() {
    return this.props.label ? <label>{this.props.label}</label> : null;
  }

  onChange(value) {
    this.setState({
      value: value
    });
  
    localStorage.setItem(this.props.name, value);
  
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <>
        {this.getLabel()}
        <select value={this.state.value} onChange={(e) => this.onChange(e.target.value)}>
          {this.props.children}
        </select>
      </>
    );
  }
}
