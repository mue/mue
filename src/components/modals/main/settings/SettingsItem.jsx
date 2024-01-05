import { memo } from 'react';

function SettingsItem({ final, title, subtitle, children }) {
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

export default memo(SettingsItem);
