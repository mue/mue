export default class EventBus {
  static listeners = {};

  /**
   * The on function adds an event listener to the document, and then pushes the callback function into
   * the listeners array.
   * @param event - The event name
   * @param callback - The function to be called when the event is triggered.
   */
  static on(event, callback) {
    document.addEventListener(event, (e) => {
      callback(e.detail);
    });
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
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
    document.removeEventListener(event, callback);
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }
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
    this.listeners[event].push({ callback, listener });
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
    this.listeners[event].unshift({ callback, listener });
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
    this.listeners[event].unshift({ callback, listener });
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
      this.listeners[event].forEach(({ listener }) => {
        document.removeEventListener(event, listener);
      });
    });
    this.listeners = {};
  }
}
