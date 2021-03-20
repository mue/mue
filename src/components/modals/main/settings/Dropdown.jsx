import React from 'react';

export default class Dropdown extends React.PureComponent {
  getLabel() {
    return this.props.label ? <label htmlFor={this.props.name}>{this.props.label}</label> : null;
  }

  componentDidMount() {
    document.getElementById(this.props.name).value = localStorage.getItem(this.props.name);
  }

  onChange = () => {
    localStorage.setItem(this.props.name, document.getElementById(this.props.name).value);
    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.getLabel()}
        <div className='dropdown' style={{ display: 'inline' }}>
          <select name={this.props.name} id={this.props.name} onChange={this.onChange}>
            {this.props.children}
          </select>
        </div>
      </React.Fragment>
    );
  }
}
