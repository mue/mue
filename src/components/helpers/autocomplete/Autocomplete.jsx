import React from 'react';

import './autocomplete.scss';

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      showList: false,
      input: ''
    };
    this.enabled = (localStorage.getItem('autocomplete') === 'true')
  }

  onChange = (e) => {
    if (this.enabled === false) {
      return this.setState({
        input: e.target.value
      });
    }

    this.setState({
      filtered: this.props.suggestions.filter((suggestion) => suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1),
      showList: true,
      input: e.target.value
    });

    this.props.onChange(e.target.value);
  };

  onClick = (e) => {
    this.setState({
      filtered: [],
      showList: false,
      input: e.target.innerText
    });

    this.props.onClick(e.target.innerText);
  };

  render() {
    let autocomplete = null;

    if (this.state.showList && this.state.input) {
      if (this.state.filtered.length && localStorage.getItem('autocomplete') === 'true') {
        autocomplete = (
          <ul className='suggestions'>
            {this.state.filtered.map((suggestion) => {
              return (
                <li key={suggestion} onClick={this.onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      }
    }

    return (
      <>
        <input
          type='text'
          onChange={this.onChange}
          value={this.state.input}
          name={this.props.name || 'name'}
          placeholder={this.props.placeholder || ''}
          autoComplete='off'
          id={this.props.id || ''} />
        {autocomplete}
      </>
    );
  }
}
