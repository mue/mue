import variables from 'config/variables';
import { MdArchive, MdOutlineWhatshot } from 'react-icons/md';
import { useState } from 'react';
import { Header } from '../components/Layout';

function StyleSelection() {
    const widgetStyle = localStorage.getItem('widgetStyle');
    const [style, setStyle] = useState({
      newStyle: widgetStyle === 'legacy' ? 'toggle newStyle' : 'toggle newStyle active',
      legacyStyle: widgetStyle === 'legacy' ? 'toggle legacyStyle active' : 'toggle legacyStyle',
    });
    
      const changeStyle = (type) => {
        setStyle({
          newStyle: type === 'new' ? 'toggle newStyle active' : 'toggle newStyle',
          legacyStyle: type === 'legacy' ? 'toggle legacyStyle active' : 'toggle legacyStyle',
        });
    
        localStorage.setItem('widgetStyle', type);
      };

    return (
        <>
        <Header title={variables.getMessage('modals.welcome.sections.style.title')} subtitle={variables.getMessage('modals.welcome.sections.style.description')} />
        <div className="themesToggleArea">
          <div className="options">
            <div className={style.legacyStyle} onClick={() => changeStyle('legacy')}>
              <MdArchive />
              <span>{variables.getMessage('modals.welcome.sections.style.legacy')}</span>
            </div>
            <div className={style.newStyle} onClick={() => changeStyle('new')}>
              <MdOutlineWhatshot />
              <span>{variables.getMessage('modals.welcome.sections.style.modern')}</span>
            </div>
          </div>
        </div>
      </>
    )
}

export { StyleSelection as default, StyleSelection };