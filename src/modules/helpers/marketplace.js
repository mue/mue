import { toast } from 'react-toastify';

export default class MarketplaceFunctions {
    static urlParser (input) { // based on https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
        const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;
        return input.replace(urlPattern, '<a href="$&" target="_blank">$&</a>');
    }

    static uninstall(name, type) {
        let installed = JSON.parse(localStorage.getItem('installed'));

        const uninstallStuff = () => {
          for (let i = 0; i < installed.length; i++) {
              if (installed[i].name === name) {
                  installed.splice(i, 1);
                  break;
              }
          }
          localStorage.setItem('installed', JSON.stringify(installed));
        };

        switch (type) {
            case 'settings':
              const oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
              localStorage.clear();
              oldSettings.forEach(item => localStorage.setItem(item.name, item.value));
              uninstallStuff();
              break;
            case 'quote_packs':
                localStorage.removeItem('quote_packs');
                localStorage.removeItem('quote_api');
                uninstallStuff();
                break;
            default:
              try {
                  localStorage.removeItem(type);
                  uninstallStuff();
              } catch (e) {
                  toast('Failed to uninstall addon, check the console');
                  console.error(e);
              }
          }
    }
}