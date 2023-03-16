import { memo } from 'react';
import PropTypes from 'prop-types';

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

SettingsItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  final: PropTypes.bool,
};

export default memo(SettingsItem);
