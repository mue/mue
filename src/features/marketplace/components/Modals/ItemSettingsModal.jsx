import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import variables from 'config/variables';
import EventBus from 'utils/eventbus';
import { Dropdown, Switch, Slider, ChipSelect } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';
import { MdRefresh, MdWarning, MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';
import { getProxiedImageUrl } from 'utils/marketplace';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import './ItemSettingsModal.scss';

const ItemSettingsModal = ({ pack, isOpen, onClose, isEnabled }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`photopack_settings_${pack.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [dynamicOptions, setDynamicOptions] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const validateSettings = useCallback(() => {
    const errors = [];
    pack.settings_schema?.forEach((field) => {
      if (field.required && !settings[field.key]) {
        errors.push(`${field.label} is required`);
      }
    });
    setValidationErrors(errors);

    const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
    const isReady = errors.length === 0;
    const isInList = apiPacksReady.includes(pack.id);

    if (isReady && !isInList) {
      apiPacksReady.push(pack.id);
      localStorage.setItem('api_packs_ready', JSON.stringify(apiPacksReady));
    } else if (!isReady && isInList) {
      const filtered = apiPacksReady.filter((id) => id !== pack.id);
      localStorage.setItem('api_packs_ready', JSON.stringify(filtered));
    }
  }, [pack.id, pack.settings_schema, settings]);

  const loadDynamicOptions = async (field) => {
    if (field.options_source === 'api:categories') {
      try {
        const response = await fetch(`${variables.constants.API_URL}/images/categories`);
        const categories = await response.json();
        setDynamicOptions((prev) => ({
          ...prev,
          [field.key]: categories,
        }));
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
  };

  useEffect(() => {
    if (!pack.settings_schema || pack.settings_schema.length === 0) {
      return;
    }
    pack.settings_schema.forEach((field) => {
      if (field.dynamic && field.options_source) {
        loadDynamicOptions(field);
      }
    });
  }, [pack.id, pack.settings_schema]);

  useEffect(() => {
    if (!pack.settings_schema || pack.settings_schema.length === 0) {
      return;
    }
    validateSettings();
  }, [settings, validateSettings, pack.settings_schema]);

  const handleSettingChange = async (key, value, secure = false) => {
    const processedValue = secure ? btoa(value) : value;
    const newSettings = { ...settings, [key]: processedValue };
    setSettings(newSettings);
    localStorage.setItem(`photopack_settings_${pack.id}`, JSON.stringify(newSettings));

    const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
    if (apiPackCache[pack.id]) {
      delete apiPackCache[pack.id];
      localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));
    }

    setIsRefreshing(true);
    await refreshAPIPackCache(pack.id);
    setIsRefreshing(false);
    EventBus.emit('refresh', 'background');
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAPIPackCache(pack.id);
    setIsRefreshing(false);
    EventBus.emit('refresh', 'background');
  };

  const renderField = (field) => {
    const value =
      field.secure && settings[field.key]
        ? atob(settings[field.key])
        : settings[field.key] || field.default;

    switch (field.type) {
      case 'dropdown': {
        const dropdownItems = field.options.map((opt) => ({
          value: opt.value,
          text: opt.label,
        }));
        return (
          <Dropdown
            label={field.label}
            name={`${pack.id}_${field.key}`}
            value={value}
            items={dropdownItems}
            onChange={(newValue) => handleSettingChange(field.key, newValue)}
          />
        );
      }

      case 'chipselect': {
        const options = field.dynamic ? dynamicOptions[field.key] || [] : field.options;
        return (
          <ChipSelect
            label={field.label}
            options={options}
            name={`${pack.id}_${field.key}`}
            onChange={(newValue) => handleSettingChange(field.key, newValue)}
          />
        );
      }

      case 'text':
        return (
          <div className="itemSettings-field-group">
            <label className="itemSettings-field-label">{field.label}</label>
            <input
              type={field.secure ? 'password' : 'text'}
              value={value}
              onChange={(e) => handleSettingChange(field.key, e.target.value, field.secure)}
              placeholder={field.placeholder || ''}
              className="itemSettings-field-input"
            />
                        {field.help_text && (
              <p className="itemSettings-field-description">{field.help_text}</p>
            )}
          </div>
        );

      case 'switch':
        return (
          <Switch
            name={`${pack.id}_${field.key}`}
            text={field.label}
            value={value}
            onChange={(newValue) => handleSettingChange(field.key, newValue)}
          />
        );

      case 'slider':
        return (
          <Slider
            title={field.label}
            name={`${pack.id}_${field.key}`}
            min={field.min || 0}
            max={field.max || 100}
            step={field.step || 1}
            value={value}
            onChange={(newValue) => handleSettingChange(field.key, newValue)}
          />
        );

      default:
        return null;
    }
  };

  const hasSettings = pack.settings_schema && pack.settings_schema.length > 0;
  const isPhotoPack = pack.type === 'photos' || pack.type === 'photo_packs';

  return (
    <Modal
      closeTimeoutMS={100}
      onRequestClose={onClose}
      isOpen={isOpen}
      className="Modal itemSettingsModal"
      overlayClassName="Overlay itemSettingsOverlay"
      ariaHideApp={false}
    >
      <div className="itemSettings-header">
        <div className="itemSettings-header-info">
          {pack.icon_url ? (
            <img
              className="itemSettings-icon"
              alt="icon"
              draggable={false}
              src={getProxiedImageUrl(pack.icon_url)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderIcon;
              }}
            />
          ) : (
            <div className="itemSettings-icon itemSettings-icon-text">
              {(pack.display_name || pack.name)?.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="itemSettings-header-text">
            <h2>{pack.display_name || pack.name}</h2>
            <span className="itemSettings-subtitle">
              {pack.author && `by ${pack.author}`}
              {pack.version && <span className="itemSettings-version">v{pack.version}</span>}
              <span className={`itemSettings-status ${isEnabled ? 'enabled' : 'disabled'}`}>
                {isEnabled ? <MdCheckCircle /> : <MdCancel />}
                {isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </span>
          </div>
        </div>
        <button className="itemSettings-close" onClick={onClose} aria-label="Close">
          <MdClose />
        </button>
      </div>

      <div className="itemSettings-content">
        {hasSettings && (
          <>
            {validationErrors.length > 0 && (
              <div className="itemSettings-error">
                <MdWarning />
                <span>Configuration incomplete: {validationErrors.join(', ')}</span>
              </div>
            )}

            <div className="itemSettings-fields">
              {pack.settings_schema.map((field) => (
                <div key={field.key} className="itemSettings-field">
                  {renderField(field)}
                </div>
              ))}
            </div>

            {isPhotoPack && (
              <div className="itemSettings-actions">
                <Button
                  onClick={handleManualRefresh}
                  icon={<MdRefresh />}
                  label={variables.getMessage(
                    'modals.main.settings.sections.background.photo_pack_settings.refresh_photos',
                  )}
                  disabled={isRefreshing || validationErrors.length > 0}
                />
              </div>
            )}
          </>
        )}

        {!hasSettings && (
          <div className="itemSettings-info">
            <div className="itemSettings-info-item">
              <span className="label">Type</span>
              <span className="value">
                {variables.getMessage(
                  'modals.main.marketplace.' + getTypeTranslationKey(pack.type),
                )}
              </span>
            </div>
            {pack.description && (
              <div className="itemSettings-info-item">
                <span className="label">Description</span>
                <span className="value">{pack.description}</span>
              </div>
            )}
            {pack.sideload && (
              <div className="itemSettings-info-item">
                <span className="label">Source</span>
                <span className="value">Sideloaded</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

function getTypeTranslationKey(type) {
  const typeMap = {
    photos: 'photo_packs',
    quotes: 'quote_packs',
    settings: 'preset_settings',
  };
  return typeMap[type] || type;
}

export default ItemSettingsModal;
