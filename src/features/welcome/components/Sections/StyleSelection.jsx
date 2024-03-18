import variables from 'config/variables';
import { MdArchive, MdOutlineWhatshot } from 'react-icons/md';
import { useState } from 'react';
import { Header, Content } from '../Layout';

const STYLES = {
  NEW: 'new',
  LEGACY: 'legacy',
};

const StyleSelection = () => {
  const widgetStyle = localStorage.getItem('widgetStyle') || STYLES.NEW;
  const [style, setStyle] = useState(widgetStyle);

  const changeStyle = (type) => {
    setStyle(type);
    localStorage.setItem('widgetStyle', type);
  };

  const styleMapping = {
    [STYLES.LEGACY]: {
      className: style === STYLES.LEGACY ? 'toggle legacyStyle active' : 'toggle legacyStyle',
      icon: <MdArchive />,
      text: variables.getMessage('modals.welcome.sections.style.legacy'),
    },
    [STYLES.NEW]: {
      className: style === STYLES.NEW ? 'toggle newStyle active' : 'toggle newStyle',
      icon: <MdOutlineWhatshot />,
      text: variables.getMessage('modals.welcome.sections.style.modern'),
    },
  };

  return (
    <Content>
      <Header
        title={variables.getMessage('modals.welcome.sections.style.title')}
        subtitle={variables.getMessage('modals.welcome.sections.style.description')}
      />
      <div className="themesToggleArea">
        <div className="options">
          {Object.entries(styleMapping).map(([type, { className, icon, text }]) => (
            <div className={className} onClick={() => changeStyle(type)} key={type}>
              {icon}
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </Content>
  );
};

export { StyleSelection as default, StyleSelection };
