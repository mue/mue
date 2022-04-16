// one day it might be a good idea to replace all this with redux, but it'd take
// a lot of rewriting
export default class EventBus {
  static on(event, callback) {
    document.addEventListener(event, (e) => {
      callback(e.detail);
    });
  }

  static dispatch(event, data) {
    document.dispatchEvent(
      new CustomEvent(event, {
        detail: data,
      }),
    );
  }

  static off(event, callback) {
    document.removeEventListener(event, callback);
  }
}
