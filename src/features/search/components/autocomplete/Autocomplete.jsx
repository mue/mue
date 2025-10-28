import { useState, useEffect } from 'react';

import EventBus from 'utils/eventbus';

import './autocomplete.scss';

const Autocomplete = ({ suggestions, onChange: onChangeCallback, onClick: onClickCallback, placeholder, id }) => {
  const [filtered, setFiltered] = useState([]);
  const [input, setInput] = useState('');
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(
    localStorage.getItem('autocomplete') !== 'true',
  );

  const onChange = (e) => {
    if (autocompleteDisabled) {
      setInput(e.target.value);
      return;
    }

    setFiltered(
      suggestions.filter(
        (suggestion) => suggestion.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
      ),
    );
    setInput(e.target.value);

    onChangeCallback(e.target.value);
  };

  const onClick = (e) => {
    setFiltered([]);
    setInput(e.target.innerText);

    onClickCallback({
      preventDefault: () => e.preventDefault(),
      target: {
        value: e.target.innerText,
      },
    });
  };

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'search') {
        setAutocompleteDisabled(localStorage.getItem('autocomplete') !== 'true');
      }
    };

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh');
    };
  }, []);

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
        placeholder={placeholder || ''}
        autoComplete="off"
        spellCheck={false}
        id={id || ''}
      />
      {autocomplete}
    </div>
  );
};

export { Autocomplete as default, Autocomplete };
