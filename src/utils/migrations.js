/**
 * Migrate existing API users to API photo packs
 * Run once on extension load after update
 */
export function migrateAPIUsersToPhotoPacks() {
  if (localStorage.getItem('api_migration_completed') === 'true') {
    return;
  }

  const backgroundType = localStorage.getItem('backgroundType');
  const backgroundAPI = localStorage.getItem('backgroundAPI');

  if (backgroundType !== 'api') {
    localStorage.setItem('api_migration_completed', 'true');
    return;
  }

  let packToInstall = null;
  if (backgroundAPI === 'mue') {
    packToInstall = {
      id: 'mue_photos',
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

    const existingQuality = localStorage.getItem('apiQuality') || 'high';
    const existingCategories = JSON.parse(localStorage.getItem('apiCategories') || '["nature"]');

    const migratedSettings = {
      quality: existingQuality,
      categories: existingCategories,
    };

    localStorage.setItem('photopack_settings_mue_photos', JSON.stringify(migratedSettings));
  } else if (backgroundAPI === 'unsplash') {
    packToInstall = {
      id: 'unsplash_photos',
      name: 'Unsplash Photos',
      type: 'photos',
      api_enabled: true,
      api_provider: 'unsplash',
      requires_api_key: false,
      photos: [],
      settings_schema: [
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

    const existingCollections = localStorage.getItem('unsplashCollections') || '';

    const migratedSettings = {
      collections: existingCollections,
    };

    localStorage.setItem('photopack_settings_unsplash_photos', JSON.stringify(migratedSettings));

    console.log('Unsplash migration: Migrated collection settings');
  }

  if (packToInstall) {
    const installed = JSON.parse(localStorage.getItem('installed') || '[]');

    if (!installed.some((item) => item.id === packToInstall.id)) {
      installed.push(packToInstall);
      localStorage.setItem('installed', JSON.stringify(installed));
    }

    const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
    if (!apiPackCache[packToInstall.id]) {
      apiPackCache[packToInstall.id] = {
        photos: [],
        last_fetched: 0,
        last_refresh_attempt: 0,
      };
      localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));
    }

    if (packToInstall.api_provider === 'mue') {
      const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
      if (!apiPacksReady.includes(packToInstall.id)) {
        apiPacksReady.push(packToInstall.id);
        localStorage.setItem('api_packs_ready', JSON.stringify(apiPacksReady));
      }
    }

    localStorage.setItem('backgroundType', 'photo_pack');

    localStorage.removeItem('imageQueue');

    if (packToInstall.api_provider === 'mue') {
      import('../features/background/api/photoPackAPI').then((module) => {
        module.refreshAPIPackCache(packToInstall.id);
      });
    }

    console.log(
      `Migrated from API background (${backgroundAPI}) to ${packToInstall.name} photo pack`,
    );
  }

  localStorage.setItem('api_migration_completed', 'true');
}
