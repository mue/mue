import { memo } from 'react';

function SettingsItem(props) {
  return (
    <div className={props.final ? 'settingsRow settingsNoBorder' : 'settingsRow'}>
      <div className="content">
        <span className="title">{props.title}</span>
        <span className="subtitle">{props.subtitle}</span>
      </div>
      <div className="action">{props.children}</div>
    </div>
  );
}

export default memo(SettingsItem);
