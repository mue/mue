export default class EventBus {
  static listeners = {};

  /**
   * The on function adds an event listener to the document, and then stores the callback and listener
   * in the listeners array.
   * @param event - The event name
   * @param callback - The function to be called when the event is triggered.
   */
  static on(event, callback) {
    const listener = (e) => {
      callback(e.detail);
    };
    document.addEventListener(event, listener);
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push({ callback, listener, capture: false });
  }

  /**
   * It creates a new custom event, and dispatches it
   * @param event - The name of the event you want to emit.
   * @param data - The data you want to pass to the event.
   */
  static emit(event, data) {
    document.dispatchEvent(
      new CustomEvent(event, {
        detail: data,
      }),
    );
  }

  /**
   * It removes an event listener from the document and removes the callback from the listeners array
   * @param event - The event to listen for.
   * @param callback - The function to be called when the event is triggered.
   */
  static off(event, callback) {
    if (!this.listeners[event]) {
      document.removeEventListener(event, callback);
      return;
    }

    this.listeners[event] = this.listeners[event].filter((registeredListener) => {
      const { callback: registeredCallback, listener, capture = false } = registeredListener;
      if (registeredCallback === callback || listener === callback) {
        document.removeEventListener(event, listener, capture);
        return false;
      }
      return true;
    });
  }

  /**
   * The once function takes an event and a callback, and then adds a listener to the event that calls
   * the callback with the event's detail, and then removes the listener.
   * @param event - The event name
   * @param callback - The function to be called when the event is triggered.
   */
  static once(event, callback) {
    const listener = (e) => {
      callback(e.detail);
      this.off(event, listener);
    };
    document.addEventListener(event, listener);
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push({ callback, listener, capture: false });
  }

  /**
   * It adds a listener to the beginning of the event listener queue.
   * @param event - The name of the event to listen for.
   * @param callback - The function to be called when the event is triggered.
   */
  static prepend(event, callback) {
    const listener = (e) => {
      callback(e.detail);
    };
    document.addEventListener(
      event,
      listener,
      true, // set `useCapture` to `true` to insert the listener at the beginning
    );
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].unshift({ callback, listener, capture: true });
  }

  /**
   * It adds an event listener to the document that will be called before any other event listeners for
   * the same event
   * @param event - The name of the event to listen for.
   * @param callback - The function to be called when the event is triggered.
   */
  static prependOnce(event, callback) {
    const listener = (e) => {
      callback(e.detail);
      this.off(event, listener);
    };
    document.addEventListener(
      event,
      listener,
      true, // set `useCapture` to `true` to insert the listener at the beginning
    );
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].unshift({ callback, listener, capture: true });
  }

  /**
   * If the event exists, return the listeners for that event, otherwise return an empty array.
   * @param event - The event name.
   * @returns An array of listeners for the event.
   */
  static getListeners(event) {
    if (this.listeners[event]) {
      return this.listeners[event];
    }
    return [];
  }

  /**
   * It returns an array of all the event names that have listeners attached to them.
   * @returns An array of the keys of the listeners object.
   */
  static eventNames() {
    return Object.keys(this.listeners);
  }

  /**
   * It removes all event listeners from the document.
   */
  static removeAllListeners() {
    Object.keys(this.listeners).forEach((event) => {
      this.listeners[event].forEach(({ listener, capture = false }) => {
        document.removeEventListener(event, listener, capture);
      });
    });
    this.listeners = {};
  }
}
