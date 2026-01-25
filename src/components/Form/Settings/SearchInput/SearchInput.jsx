import { memo } from 'react';
import { MdSearch } from 'react-icons/md';

import './SearchInput.scss';

const SearchInput = memo(({ value, onChange, placeholder, fullWidth }) => {
  return (
    <div className={`search-input-container${fullWidth ? ' full-width' : ''}`}>
      <MdSearch className="search-input-icon" />
      <input
        type="text"
        className="search-input-field"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export { SearchInput as default, SearchInput };
