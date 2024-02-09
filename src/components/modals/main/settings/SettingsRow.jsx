import { memo } from 'react';

function SettingsRow({ final, title, subtitle, children }) {
  return (
    <div className={final ? 'settingsRow settingsNoBorder' : 'settingsRow'}>
      <div className="content">
        <span className="title">{title}</span>
        <span className="subtitle">{subtitle}</span>
      </div>
      <div className="action">{children}</div>
    </div>
  );
}

export default memo(SettingsRow);
