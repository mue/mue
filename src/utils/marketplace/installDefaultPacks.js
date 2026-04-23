import variables from 'config/variables';
import defaultPacks from 'config/defaultPacks.json';
import { install } from './install';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';

export async function installDefaultPacks() {
  if (localStorage.getItem('defaultPacksNeedInstall') !== 'true') {
    console.log('[Default Packs] Already installed, skipping');
    return;
  }

  console.log('[Default Packs] Installing default packs...', defaultPacks);

  const installed = [];
  const enabledPacks = {};

  for (const [type, packs] of Object.entries(defaultPacks)) {
    console.log(`[Default Packs] Processing ${type} packs:`, packs);

    for (const pack of packs) {
      try {
        console.log(`[Default Packs] Fetching pack ${pack.id}, enabled: ${pack.enabled}`);
        const response = await fetch(`${variables.constants.API_URL}/marketplace/item/${pack.id}`);
        const { data } = await response.json();

        if (data && data.type === type) {
          console.log(`[Default Packs] Installing ${data.display_name || data.name}`, data);
          installed.push(data);
          enabledPacks[data.id] = pack.enabled;

          install(type, data, false, true);

          if (type === 'photos' && data.api_enabled && pack.enabled && !data.requires_api_key) {
            console.log(`[Default Packs] Refreshing API cache for enabled pack: ${data.id}`);
            refreshAPIPackCache(data.id);
          }
        }
      } catch (error) {
        console.error(`[Default Packs] Failed to install default ${type} pack ${pack.id}:`, error);
      }
    }
  }

  if (installed.length > 0) {
    const existingEnabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    localStorage.setItem(
      'enabledPacks',
      JSON.stringify({ ...existingEnabledPacks, ...enabledPacks }),
    );
    console.log('[Default Packs] Set enabledPacks:', enabledPacks);

    localStorage.removeItem('defaultPacksNeedInstall');
    window.dispatchEvent(new Event('installedAddonsChanged'));
    console.log('[Default Packs] Installation complete');
  }
}
