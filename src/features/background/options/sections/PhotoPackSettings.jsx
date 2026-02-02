import React, { useState, useEffect } from 'react';
import variables from 'config/variables';
import EventBus from 'utils/eventbus';
import { Dropdown, Text, Switch, Slider } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { Button } from 'components/Elements';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';
import { MdRefresh, MdWarning } from 'react-icons/md';

/**
 * ChipSelect component for multi-select options
 */
const ChipSelect = ({ label, options, defaultValue, name, onChange }) => {
  const [selected, setSelected] = useState(defaultValue || []);

  const toggleChip = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500 }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleChip(option.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: '1px solid',
              borderColor: selected.includes(option.value) ? '#4CAF50' : '#ccc',
              backgroundColor: selected.includes(option.value) ? '#4CAF50' : 'transparent',
              color: selected.includes(option.value) ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const PhotoPackSettings = ({ pack }) => {
  if (!pack.settings_schema || pack.settings_schema.length === 0) {
    return null;
  }

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`photopack_settings_${pack.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [dynamicOptions, setDynamicOptions] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Load dynamic options (e.g., categories from API)
  useEffect(() => {
    pack.settings_schema.forEach((field) => {
      if (field.dynamic && field.options_source) {
        loadDynamicOptions(field);
      }
    });
  }, [pack.id]);

  // Validate settings
  useEffect(() => {
    validateSettings();
  }, [settings]);

  const loadDynamicOptions = async (field) => {
    if (field.options_source === 'api:categories') {
      try {
        const response = await fetch(`${variables.constants.API_URL}/images/categories`);
        const categories = await response.json();
        setDynamicOptions((prev) => ({
          ...prev,
          [field.key]: categories.map((cat) => ({ value: cat, label: cat })),
        }));
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
  };

  const validateSettings = () => {
    const errors = [];
    pack.settings_schema.forEach((field) => {
      if (field.required && !settings[field.key]) {
        errors.push(`${field.label} is required`);
      }
    });
    setValidationErrors(errors);

    // Update api_packs_ready list
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
  };

  const handleSettingChange = (key, value, secure = false) => {
    const processedValue = secure ? btoa(value) : value;
    const newSettings = { ...settings, [key]: processedValue };
    setSettings(newSettings);
    localStorage.setItem(`photopack_settings_${pack.id}`, JSON.stringify(newSettings));
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAPIPackCache(pack.id);
    setIsRefreshing(false);
    // Trigger background refresh
    EventBus.emit('refresh', 'background');
  };

  const renderField = (field, index) => {
    const value =
      field.secure && settings[field.key] ? atob(settings[field.key]) : settings[field.key] || field.default;

    switch (field.type) {
      case 'dropdown':
        return (
          <Dropdown
            label={field.label}
            name={`${pack.id}_${field.key}`}
            value={value}
            items={field.options}
            onChange={(newValue) => handleSettingChange(field.key, newValue)}
          />
        );

      case 'chipselect':
        const options = field.dynamic ? dynamicOptions[field.key] || [] : field.options;
        return (
          <ChipSelect
            label={field.label}
            options={options}
            defaultValue={value}
            name={`${pack.id}_${field.key}`}
            onChange={(newValue) => handleSettingChange(field.key, newValue)}
          />
        );

      case 'text':
        return (
          <Text
            title={field.label}
            placeholder={field.placeholder}
            value={value}
            name={`${pack.id}_${field.key}`}
            type={field.secure ? 'password' : 'text'}
            onChange={(e) => handleSettingChange(field.key, e.target.value, field.secure)}
            subtitle={field.help_text}
          />
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

  return (
    <>
      <Row>
        <Content
          title={`${pack.name} Settings`}
          subtitle={pack.api_provider === 'mue' ? 'MUE API' : 'Unsplash API'}
        />
        <Action>
          <Button
            onClick={handleManualRefresh}
            icon={<MdRefresh />}
            label="Refresh Photos"
            disabled={isRefreshing || validationErrors.length > 0}
          />
        </Action>
      </Row>

      {validationErrors.length > 0 && (
        <Row>
          <Content>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f44336' }}>
              <MdWarning />
              <span>Configuration incomplete: {validationErrors.join(', ')}</span>
            </div>
          </Content>
        </Row>
      )}

      {pack.settings_schema.map((field, index) => (
        <Row key={field.key} final={index === pack.settings_schema.length - 1}>
          <Content title="" />
          <Action>{renderField(field, index)}</Action>
        </Row>
      ))}
    </>
  );
};

export default PhotoPackSettings;
