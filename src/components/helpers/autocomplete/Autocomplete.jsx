import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import EventBus from 'modules/helpers/eventbus';

import './autocomplete.scss';

class Autocomplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      input: '',
      autocompleteDisabled: localStorage.getItem('autocomplete') !== 'true',
    };
  }

  onChange = (e) => {
    if (this.state.autocompleteDisabled) {
      return this.setState({
        input: e.target.value,
      });
    }

    this.setState({
      filtered: this.props.suggestions.filter(
        (suggestion) => suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
      ),
      input: e.target.value,
    });

    this.props.onChange(e.target.value);
  };

  onClick = (e) => {
    this.setState({
      filtered: [],
      input: e.target.innerText,
    });

    this.props.onClick({
      preventDefault: () => e.preventDefault(),
      target: {
        value: e.target.innerText,
      },
    });
  };

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'search') {
        this.setState({
          autocompleteDisabled: localStorage.getItem('autocomplete') !== 'true',
        });
      }
    });
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    let autocomplete = null;

    // length will only be > 0 if enabled
    if (this.state.filtered.length > 0 && this.state.input.length > 0) {
      autocomplete = (
        <div className="suggestions">
          {this.state.filtered.map((suggestion) => (
            <div key={suggestion} onClick={this.onClick}>
              {suggestion}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexFlow: 'column' }}>
        <input
          type="text"
          onChange={this.onChange}
          value={this.state.input}
          placeholder={this.props.placeholder || ''}
          autoComplete="off"
          spellCheck={false}
          id={this.props.id || ''}
        />
        {autocomplete}
      </div>
    );
  }
}

Autocomplete.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default Autocomplete;
