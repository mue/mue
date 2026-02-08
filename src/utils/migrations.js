/**
 * Migrate all users to marketplace pack system
 * - Installs default photo packs (Mue + Unsplash) and quote pack for everyone
 * - For API users: migrates settings and enables correct packs
 * - For non-API users: installs with default enabled states
 * Run once on extension load after update
 */
export async function migrateAPIUsersToPhotoPacks() {
  if (localStorage.getItem('api_migration_completed') === 'true') {
    return;
  }

  const backgroundType = localStorage.getItem('backgroundType');
  const installed = JSON.parse(localStorage.getItem('installed') || '[]');

  // Skip migration for fresh installs (no backgroundType and no installed packs)
  // Fresh installs will use installDefaultPacks.js instead
  if (!backgroundType && installed.length === 0) {
    localStorage.setItem('api_migration_completed', 'true');
    return;
  }

  const backgroundAPI = localStorage.getItem('backgroundAPI') || 'mue';
  const quoteType = localStorage.getItem('quoteType');
  const wasUsingAPIBackgrounds = backgroundType === 'api';
  const wasUsingAPIQuotes = quoteType === 'api';

  const { default: variables } = await import('config/variables');
  const { default: defaultPacks } = await import('config/defaultPacks.json');
  const { install } = await import('./marketplace/install');
  const { refreshAPIPackCache } = await import('../features/background/api/photoPackAPI');

  // Get existing installed packs to check for duplicates
  const installedIds = installed.map((p) => p.id || p.name);

  const photoPacks = defaultPacks.photos || [];
  const quotePacks = defaultPacks.quotes || [];
  const enabledPacks = {};

  // Photo Pack Migration (ALL users)
  if (wasUsingAPIBackgrounds) {
    // Preserve existing settings for API users
    const existingQuality = localStorage.getItem('apiQuality') || 'high';
    const existingCategories = JSON.parse(localStorage.getItem('apiCategories') || '["nature"]');
    const existingCollections = localStorage.getItem('unsplashCollections') || '';

    for (const pack of photoPacks) {
      try {
        if (installedIds.includes(pack.id)) {
          const data = installed.find((p) => p.id === pack.id);
          if (data) {
            enabledPacks[pack.id] = data.api_provider === backgroundAPI;
          }
          continue;
        }

        const response = await fetch(`${variables.constants.API_URL}/marketplace/item/${pack.id}`);
        const { data } = await response.json();

        if (data && data.type === 'photos') {
          // Migrate settings based on which API provider they were using
          if (data.api_provider === 'mue') {
            localStorage.setItem(
              `photopack_settings_${data.id}`,
              JSON.stringify({
                quality: existingQuality,
                categories: existingCategories,
              }),
            );
          } else if (data.api_provider === 'unsplash') {
            localStorage.setItem(
              `photopack_settings_${data.id}`,
              JSON.stringify({
                collections: existingCollections,
              }),
            );
          }

          // Install the pack
          install('photos', data, false, false);

          // Enable only the pack matching their current backgroundAPI
          enabledPacks[data.id] = data.api_provider === backgroundAPI;

          // Refresh cache if this is the active pack
          if (data.api_provider === backgroundAPI && data.api_enabled && !data.requires_api_key) {
            refreshAPIPackCache(data.id);
          }

        }
      } catch (error) {
        console.error(`[Migration] Failed to install photo pack ${pack.id}:`, error);
      }
    }

    // Update background type for API users
    localStorage.setItem('backgroundType', 'photo_pack');
    localStorage.removeItem('imageQueue');
  } else {
    // Install both packs with default enabled states for non-API users
    for (const pack of photoPacks) {
      try {
        if (installedIds.includes(pack.id)) {
          continue;
        }

        const response = await fetch(`${variables.constants.API_URL}/marketplace/item/${pack.id}`);
        const { data } = await response.json();

        if (data && data.type === 'photos') {
          install('photos', data, false, false);
          enabledPacks[data.id] = pack.enabled;
        }
      } catch (error) {
        console.error(`[Migration] Failed to install photo pack ${pack.id}:`, error);
      }
    }
  }

  // Quote Pack Migration (ALL users)
  for (const pack of quotePacks) {
    try {
      if (installedIds.includes(pack.id)) {
        enabledPacks[pack.id] = true;
        continue;
      }

      const response = await fetch(`${variables.constants.API_URL}/marketplace/item/${pack.id}`);
      const { data } = await response.json();

      if (data && data.type === 'quotes') {
        install('quotes', data, false, false);
        enabledPacks[data.id] = true;
      }
    } catch (error) {
      console.error(`[Migration] Failed to install quote pack ${pack.id}:`, error);
    }
  }

  // Update quoteType for API quote users
  if (wasUsingAPIQuotes) {
    localStorage.setItem('quoteType', 'quote_pack');
  }

  // Update enabled packs
  const existingEnabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
  localStorage.setItem('enabledPacks', JSON.stringify({ ...existingEnabledPacks, ...enabledPacks }));

  localStorage.setItem('api_migration_completed', 'true');
}
