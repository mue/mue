import './SettingsLoader.scss';

const SettingsLoader = () => {
  return (
    <div className="settings-loader">
      <div className="loader-header-section">
        <div className="loader-header-left">
          <div className="loader-title shimmer"></div>
        </div>
        <div className="loader-header-right">
          <div className="loader-button shimmer"></div>
          <div className="loader-button shimmer"></div>
        </div>
      </div>

      <div className="loader-section">
        <div className="loader-section-title shimmer"></div>
        <div className="loader-section-subtitle shimmer"></div>
      </div>

      <div className="loader-options">
        <div className="loader-option-row">
          <div className="loader-option-left">
            <div className="loader-option-label shimmer"></div>
            <div className="loader-option-desc shimmer"></div>
          </div>
          <div className="loader-toggle shimmer"></div>
        </div>

        <div className="loader-option-row">
          <div className="loader-option-left">
            <div className="loader-option-label shimmer"></div>
            <div className="loader-option-desc shimmer"></div>
          </div>
          <div className="loader-toggle shimmer"></div>
        </div>

        <div className="loader-option-row">
          <div className="loader-option-left">
            <div className="loader-option-label shimmer"></div>
          </div>
          <div className="loader-select shimmer"></div>
        </div>

        <div className="loader-option-row">
          <div className="loader-option-left">
            <div className="loader-option-label shimmer"></div>
          </div>
          <div className="loader-slider shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLoader;
