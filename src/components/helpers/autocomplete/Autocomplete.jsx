import { PureComponent } from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import './autocomplete.scss';

export default class Autocomplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      input: '',
      autocompleteDisabled: (localStorage.getItem('autocomplete') !== 'true')
    };
  }

  onChange = (e) => {
    if (this.state.autocompleteDisabled) {
      return this.setState({
        input: e.target.value
      });
    }

    this.setState({
      filtered: this.props.suggestions.filter((suggestion) => suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1),
      input: e.target.value
    });

    this.props.onChange(e.target.value);
  };

  onClick = (e) => {
    this.setState({
      filtered: [],
      input: e.target.innerText
    });

    this.props.onClick(e);
  };

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'search') {
        this.setState({
          autocompleteDisabled: (localStorage.getItem('autocomplete') !== 'true')
        });
      }
    });
  }

  render() {
    let autocomplete = null;

    // length will only be > 0 if enabled
    if (this.state.filtered.length > 0 && this.state.input.length > 0) {
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

    return (
      <>
        <input
          type='text'
          onChange={this.onChange}
          value={this.state.input}
          placeholder={this.props.placeholder || ''}
          autoComplete='off'
          id={this.props.id || ''} />
        {autocomplete}
      </>
    );
  }
}
