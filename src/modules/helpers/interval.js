// based on https://stackoverflow.com/a/47009962
// it has been brought to my attention (many) times that this is horribly broken if the time
// on the "Change every" setting is longer than 1 minute. I wasn't going to wait days to see
// if the function worked, so i just assumed it did. i apologise. this function will be
// replaced entirely in the future probably
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
