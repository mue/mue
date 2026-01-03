import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import variables from 'config/variables';
import { install, uninstall } from 'utils/marketplace';

const API_V2_BASE = `${variables.constants.API_URL}/marketplace`;

export const useMarketplaceInstall = () => {
  const [busy, setBusy] = useState(false);
  const controllerRef = useRef(new AbortController());

  const installItem = (type, data) => {
    install(type, data);
    toast(variables.getMessage('toasts.installed'));
    variables.stats.postEvent('marketplace-item', `${data.display_name || data.name} installed`);
    variables.stats.postEvent('marketplace', 'Install');
  };

  const uninstallItem = (type, name) => {
    uninstall(type, name);
    toast(variables.getMessage('toasts.uninstalled'));
    variables.stats.postEvent('marketplace-item', `${name} uninstalled`);
    variables.stats.postEvent('marketplace', 'Uninstall');
  };

  const installCollection = async (items) => {
    setBusy(true);
    try {
      const installed = JSON.parse(localStorage.getItem('installed')) || [];

      for (const item of items) {
        // Skip if already installed
        if (installed.some((i) => i.name === item.display_name)) {
          continue;
        }

        // Fetch full item data
        const itemEndpoint = item.id
          ? `${API_V2_BASE}/item/${item.id}`
          : `${API_V2_BASE}/item/${item.type}/${item.name}`;

        const response = await fetch(itemEndpoint, {
          signal: controllerRef.current.signal,
        });
        const { data } = await response.json();

        // Install item
        install(data.type, data, false, true);
        variables.stats.postEvent('marketplace-item', `${item.display_name} installed`);
        variables.stats.postEvent('marketplace', 'Install');
      }

      toast(variables.getMessage('toasts.installed'));
      window.location.reload();
    } catch (error) {
      if (!controllerRef.current.signal.aborted) {
        console.error('Failed to install collection:', error);
        toast(variables.getMessage('toasts.error'));
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