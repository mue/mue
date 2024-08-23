import { useEffect, useState } from 'react';

import EventBus from 'utils/eventbus';

import './autocomplete.scss';

function Autocomplete(props) {
  const [filtered, setFiltered] = useState([]);
  const [input, setInput] = useState('');
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(
    localStorage.getItem('autocomplete') !== 'true',
  );

  const onChange = (e) => {
    if (autocompleteDisabled) {
      return setInput(e.target.value);
    }

    setFiltered(
      props.suggestions.filter(
        (suggestion) => suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
      ),
    );
    setInput(e.target.value);
    props.onChange(e.target.value);
  };

  const onClick = (e) => {
    setFiltered([]);
    setInput(e.target.innerText);
    props.onClick({
      preventDefault: () => e.preventDefault(),
      target: {
        value: e.target.innerText,
      },
    });
  };

  useEffect(() => {
    EventBus.on('refresh', (data) => {
      if (data === 'search') {
        setAutocompleteDisabled(localStorage.getItem('autocomplete') !== 'true');
      }
    });

    return () => {
      EventBus.off('refresh');
    };
  });

  let autocomplete = null;

  // length will only be > 0 if enabled
  if (filtered.length > 0 && input.length > 0) {
    autocomplete = (
      <div className="suggestions">
        {filtered.map((suggestion) => (
          <div key={suggestion} onClick={onClick}>
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
        onChange={onChange}
        value={input}
        placeholder={props.placeholder || ''}
        autoComplete="off"
        spellCheck={false}
        id={props.id || ''}
      />
      {autocomplete}
    </div>
  );
}

export { Autocomplete as default, Autocomplete };
