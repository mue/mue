/**
 * Migrate existing API users to API photo packs
 * Run once on extension load after update
 */
export function migrateAPIUsersToPhotoPacks() {
  // Check if migration already completed
  if (localStorage.getItem('api_migration_completed') === 'true') {
    return;
  }

  const backgroundType = localStorage.getItem('backgroundType');
  const backgroundAPI = localStorage.getItem('backgroundAPI');

  // Only migrate if user is currently using API backgrounds
  if (backgroundType !== 'api') {
    localStorage.setItem('api_migration_completed', 'true');
    return;
  }

  let packToInstall = null;

  // Determine which API pack to install
  if (backgroundAPI === 'mue') {
    packToInstall = {
      id: 'mue-photos',
      name: 'MUE Daily Photos',
      type: 'photos',
      api_enabled: true,
      api_provider: 'mue',
      requires_api_key: false,
      photos: [],
      settings_schema: [
        {
          key: 'quality',
          type: 'dropdown',
          label: 'Image Quality',
          default: 'high',
          required: true,
          options: [
            { value: 'low', label: 'Low (Faster)' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High (Best Quality)' },
          ],
        },
        {
          key: 'categories',
          type: 'chipselect',
          label: 'Categories',
          default: ['nature'],
          required: true,
          dynamic: true,
          options_source: 'api:categories',
        },
      ],
      version: '1.0.0',
      author: 'MUE Team',
      description: 'Fresh photos from MUE API',
      icon_url: 'https://raw.githubusercontent.com/mue/branding/main/logo/logo_square.png',
    };

    // Port existing settings
    const existingQuality = localStorage.getItem('apiQuality') || 'high';
    const existingCategories = JSON.parse(localStorage.getItem('apiCategories') || '["nature"]');

    const migratedSettings = {
      quality: existingQuality,
      categories: existingCategories,
    };

    localStorage.setItem('photopack_settings_mue-photos', JSON.stringify(migratedSettings));
  } else if (backgroundAPI === 'unsplash') {
    packToInstall = {
      id: 'unsplash-photos',
      name: 'Unsplash Photos',
      type: 'photos',
      api_enabled: true,
      api_provider: 'unsplash',
      requires_api_key: true,
      photos: [],
      settings_schema: [
        {
          key: 'api_key',
          type: 'text',
          label: 'Unsplash Access Key',
          placeholder: 'Enter your Unsplash API key',
          default: '',
          required: true,
          secure: true,
          help_text: 'Get your free API key at https://unsplash.com/developers',
        },
        {
          key: 'collections',
          type: 'text',
          label: 'Collection IDs',
          placeholder: 'e.g. 123456, 654321',
          default: '',
          required: false,
        },
      ],
      version: '1.0.0',
      author: 'MUE Team',
      description: 'Photos from Unsplash collections',
      icon_url: 'https://raw.githubusercontent.com/mue/branding/main/logo/logo_square.png',
    };

    // Port existing Unsplash settings (collection IDs only, not API key since it's server-side)
    const existingCollections = localStorage.getItem('unsplashCollections') || '';

    const migratedSettings = {
      collections: existingCollections,
      api_key: '', // User will need to provide their own API key
    };

    localStorage.setItem('photopack_settings_unsplash-photos', JSON.stringify(migratedSettings));

    // Note: Unsplash users will need to configure their API key after migration
    console.log('Unsplash migration: Please configure your API key in photo pack settings');
  }

  if (packToInstall) {
    // Install the pack
    const installed = JSON.parse(localStorage.getItem('installed') || '[]');

    // Check if not already installed
    if (!installed.some((item) => item.id === packToInstall.id)) {
      installed.push(packToInstall);
      localStorage.setItem('installed', JSON.stringify(installed));
    }

    // Initialize cache
    const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
    if (!apiPackCache[packToInstall.id]) {
      apiPackCache[packToInstall.id] = {
        photos: [],
        last_fetched: 0,
        last_refresh_attempt: 0,
      };
      localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));
    }

    // Add to ready list if MUE (no API key required)
    if (packToInstall.api_provider === 'mue') {
      const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
      if (!apiPacksReady.includes(packToInstall.id)) {
        apiPacksReady.push(packToInstall.id);
        localStorage.setItem('api_packs_ready', JSON.stringify(apiPacksReady));
      }
    }

    // Change background type to photo_pack
    localStorage.setItem('backgroundType', 'photo_pack');

    // Clear old queue
    localStorage.removeItem('imageQueue');

    // Fetch initial photos for MUE
    if (packToInstall.api_provider === 'mue') {
      import('../features/background/api/photoPackAPI').then((module) => {
        module.refreshAPIPackCache(packToInstall.id);
      });
    }

    console.log(
      `Migrated from API background (${backgroundAPI}) to ${packToInstall.name} photo pack`,
    );
  }

  // Mark migration as completed
  localStorage.setItem('api_migration_completed', 'true');
}
