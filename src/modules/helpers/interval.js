// based on https://stackoverflow.com/a/47009962
export default function interval(callback, interval, name) {
  const key = name + 'interval';
  const ms = localStorage.getItem(key);
  const now = Date.now();

  const executeCallback = () => {
    localStorage.setItem(key, Date.now());
    callback();
  };

  if (ms) {
    const delta = now - parseInt(ms);
    if (delta > interval) {
      setInterval(executeCallback, interval);
    } else {
      setTimeout(() => {
        setInterval(executeCallback, interval);
        executeCallback();
      }, interval - delta);
    }
  } else {
    setInterval(executeCallback, interval);
  }

  localStorage.setItem(key, now);
}
