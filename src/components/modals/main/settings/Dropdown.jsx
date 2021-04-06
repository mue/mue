import React from 'react';

export default class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || '',
      title: ''
    };
  }

  getLabel = () => {
    return this.props.label ? <label>{this.props.label}</label> : null;
  }

  onChange = (e) => {
    const { value } = e.target;

    this.setState({
      value: value,
      title: e.target[e.target.selectedIndex].text
    });
  
    localStorage.setItem(this.props.name, value);
  
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  // todo: find a better way to do this
  componentDidMount() {
    const element = document.getElementById(this.props.name);
    this.setState({
      title: element[element.selectedIndex].text
    });
  }

  render() {
    return (
      <>
        {this.getLabel}
        <select id={this.props.name} value={this.state.value} onChange={this.onChange} style={{width: `${(8*this.state.title.length) + 50}px`}}>
          {this.props.children}
        </select>
      </>
    );
  }
}
