export default class Stats {
  static async postEvent(type, name) {
    const value = name.toLowerCase().replaceAll(' ', '-');

    const data = JSON.parse(localStorage.getItem('statsData'));
    // tl;dr this creates the objects if they don't exist
    // this really needs a cleanup at some point
    if (!data[type] || !data[type][value]) {
      if (!data[type]) {
        data[type] = {};
      }

      if (!data[type][value]) {
        data[type][value] = 1;
      }
    } else {
      data[type][value] = data[type][value] + 1;
    }
    localStorage.setItem('statsData', JSON.stringify(data));
  }

  static async tabLoad() {
    const data = JSON.parse(localStorage.getItem('statsData'));
    data['tabs-opened'] = data['tabs-opened'] + 1 || 1;        
    localStorage.setItem('statsData', JSON.stringify(data));
  }
}
