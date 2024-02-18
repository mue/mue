export default class Stats {
  /**
   * It takes two arguments, a type and a name, and then it increments the value of the name in the type
   * object in localStorage
   * @param type - The type of event you want to track. This can be anything you want, but I recommend
   * using something like "click" or "hover"
   * @param name - The name of the event.
   */
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

  /**
   * It increments the value of the key 'tabs-opened' in the object stored in localStorage by 1.
   */
  static async tabLoad() {
    const data = JSON.parse(localStorage.getItem('statsData'));
    data['tabs-opened'] = data['tabs-opened'] + 1 || 1;
    localStorage.setItem('statsData', JSON.stringify(data));
  }
}
