import { useState, useEffect, useCallback } from 'react';
import variables from 'config/variables';
import EventBus from 'utils/eventbus';
import { Dropdown, Text, Switch, Slider, ChipSelect } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import { Button } from 'components/Elements';
import { Section } from 'components/Layout/Settings';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';
import { MdRefresh, MdWarning, MdExpandMore, MdExpandLess } from 'react-icons/md';

const PhotoPackSettings = ({ pack }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`photopack_settings_${pack.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [dynamicOptions, setDynamicOptions] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const validateSettings = useCallback(() => {
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

  // Load dynamic options (e.g., categories from API)
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

  // Validate settings
  useEffect(() => {
    if (!pack.settings_schema || pack.settings_schema.length === 0) {
      return;
    }
    validateSettings();
  }, [settings, validateSettings, pack.settings_schema]);

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

  if (!pack.settings_schema || pack.settings_schema.length === 0) {
    return null;
  }

  return (
    <>
      <Section
        title={variables.getMessage(
          'modals.main.settings.sections.background.photo_pack_settings.title',
          {
            name: pack.display_name || pack.name,
          },
        )}
        subtitle={
          pack.api_provider === 'mue'
            ? variables.getMessage('modals.main.settings.sections.background.source.api')
            : variables.getMessage('modals.main.settings.sections.background.unsplash.subtitle')
        }
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
      </Section>

      {isExpanded && (
        <>
          <Row>
            <Content title="" />
            <Action>
              <Button
                onClick={handleManualRefresh}
                icon={<MdRefresh />}
                label={variables.getMessage(
                  'modals.main.settings.sections.background.photo_pack_settings.refresh_photos',
                )}
                disabled={isRefreshing || validationErrors.length > 0}
              />
            </Action>
          </Row>

          {validationErrors.length > 0 && (
            <Row>
              <Content>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f44336' }}
                >
                  <MdWarning />
                  <span>Configuration incomplete: {validationErrors.join(', ')}</span>
                </div>
              </Content>
            </Row>
          )}

          {pack.settings_schema.map((field, index) => (
            <Row key={field.key} final={index === pack.settings_schema.length - 1}>
              <Content title="" />
              <Action>{renderField(field)}</Action>
            </Row>
          ))}
        </>
      )}
    </>
  );
};

export default PhotoPackSettings;
