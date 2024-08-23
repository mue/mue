import variables from 'config/variables';

function Dropdown({
  url,
  setURL,
  setQuery,
  setCurrentSearch,
  currentSearch,
  searchDropdown,
  setSearchDropdown,
  searchEngines,
}) {
  const customText = variables.getMessage('settings:sections.search.custom').split(' ')[0];

  function setSearch(name, custom) {
    let _url;
    let _query = 'q';
    const info = searchEngines.find((i) => i.name === name);

    if (info !== undefined) {
      _url = info.url;
      if (info.query) {
        _query = info.query;
      }
    }

    if (custom) {
      const customSetting = localStorage.getItem('customSearchEngine');
      if (customSetting !== null) {
        _url = customSetting;
      } else {
        _url = url;
      }
    } else {
      localStorage.setItem('searchEngine', info.settingsName);
    }

    setURL(_url);
    setQuery(_query);
    setCurrentSearch(name);
    setSearchDropdown(false);
  }

  const dropdownEnabled = localStorage.getItem('searchDropdown') === 'true';

  if (!dropdownEnabled || !searchDropdown) {
    return null;
  }

  return (
    <div className="searchDropdown">
      {searchEngines.map(({ name }, key) => {
        return (
          <span
            className={
              'searchDropdownList' + (currentSearch === name ? ' searchDropdownListActive' : '')
            }
            onClick={() => setSearch(name)}
            key={key}
          >
            {name}
          </span>
        );
      })}
      <span
        className={
          'searchDropdownList' + (currentSearch === customText ? ' searchDropdownListActive' : '')
        }
        onClick={() => setSearch(customText, 'custom')}
      >
        {customText}
      </span>
    </div>
  );
}

export { Dropdown as default, Dropdown };
