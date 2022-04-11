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
