export default class MarketplaceFunctions {
    static urlParser (input) { // based on https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
        let urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;
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
        }

        switch (type) {
            case 'settings':
              let oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
              localStorage.clear();
              oldSettings.forEach(item => localStorage.setItem(item.name, item.value));
              uninstallStuff();
              break;
            default:
              try {
                  localStorage.removeItem(type);
                  uninstallStuff();
              } catch (e) {
                  console.log('invalid');
              }
          }
    }
}