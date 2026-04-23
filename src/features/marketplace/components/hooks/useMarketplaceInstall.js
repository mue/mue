import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useT } from 'contexts';
import variables from 'config/variables';
import { install, uninstall } from 'utils/marketplace';

const API_V2_BASE = `${variables.constants.API_URL}/marketplace`;

export const useMarketplaceInstall = () => {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const controllerRef = useRef(new AbortController());

  const installItem = (type, data) => {
    const installed = JSON.parse(localStorage.getItem('installed') || '[]');
    const isNewInstall = !installed.some((item) => item.id === data.id || item.name === data.name);

    install(type, data);
    toast(t('toasts.installed'));
    variables.stats.postEvent('marketplace-item', `${data.display_name || data.name} installed`);
    variables.stats.postEvent('marketplace', 'Install');
    window.dispatchEvent(new Event('installedAddonsChanged'));
  };

  const uninstallItem = (type, name) => {
    uninstall(type, name);
    toast(t('toasts.uninstalled'));
    variables.stats.postEvent('marketplace-item', `${name} uninstalled`);
    variables.stats.postEvent('marketplace', 'Uninstall');
    window.dispatchEvent(new Event('installedAddonsChanged'));
  };

  const installCollection = async (items) => {
    setBusy(true);
    try {
      const installed = JSON.parse(localStorage.getItem('installed')) || [];

      for (const item of items) {
        if (installed.some((i) => i.name === item.display_name)) {
          continue;
        }

        const itemEndpoint = item.id
          ? `${API_V2_BASE}/item/${item.id}`
          : `${API_V2_BASE}/item/${item.type}/${item.name}`;

        const response = await fetch(itemEndpoint, {
          signal: controllerRef.current.signal,
        });
        const { data } = await response.json();

        install(data.type, data, false, true);
        variables.stats.postEvent('marketplace-item', `${item.display_name} installed`);
        variables.stats.postEvent('marketplace', 'Install');
      }

      toast(t('toasts.installed'));
      window.dispatchEvent(new Event('installedAddonsChanged'));
      window.location.reload();
    } catch (error) {
      if (!controllerRef.current.signal.aborted) {
        console.error('Failed to install collection:', error);
        toast(t('toasts.error'));
      }
    } finally {
      setBusy(false);
    }
  };

  return {
    busy,
    installItem,
    uninstallItem,
    installCollection,
  };
};
