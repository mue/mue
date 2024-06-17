import variables from 'config/variables';
import { MdScreenSearchDesktop } from 'react-icons/md';
import { BsGoogle } from 'react-icons/bs';
import { SiDuckduckgo, SiMicrosoftbing, SiBaidu, SiNaver } from 'react-icons/si';
import { FaYandex, FaYahoo } from 'react-icons/fa';
import { Tooltip } from 'components/Elements';

function Icon({ currentSearch, searchDropdown, setSearchDropdown }) {
  function getSearchDropdownicon(name) {
    switch (name) {
      case 'Google':
        return <BsGoogle />;
      case 'DuckDuckGo':
        return <SiDuckduckgo />;
      case 'Bing':
        return <SiMicrosoftbing />;
      case 'Yahoo':
      case 'Yahoo! JAPAN':
        return <FaYahoo />;
      case 'Яндекс':
        return <FaYandex />;
      case '百度':
        return <SiBaidu />;
      case 'NAVER':
        return <SiNaver />;
      default:
        return <MdScreenSearchDesktop />;
    }
  }

  const dropdownEnabled = localStorage.getItem('searchDropdown') === 'true';

  if (!dropdownEnabled) {
    return null;
  }

  return (
    <Tooltip title={variables.getMessage('settings:sections.search.search_engine')}>
      <button
        className="navbarButton"
        aria-label="Search Engine"
        onClick={() => setSearchDropdown(!searchDropdown)}
      >
        {getSearchDropdownicon(currentSearch)}
      </button>
    </Tooltip>
  );
}

export { Icon as default, Icon };
