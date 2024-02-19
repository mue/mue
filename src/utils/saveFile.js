/**
 * It creates a link to a file, and then clicks it
 * @param data - the data you want to save
 * @param [filename=file] - the name of the file to be saved
 * @param [type=text/json] - the type of file you want to save.
 */
export function saveFile(data, filename = 'file', type = 'text/json') {
  if (typeof data === 'object') {
    data = JSON.stringify(data, undefined, 4);
  }

  const blob = new Blob([data], { type });

  const event = document.createEvent('MouseEvents');
  const a = document.createElement('a');

  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.dataset.downloadurl = [type, a.download, a.href].join(':');

  // i need to see what all this actually does, i think wessel wrote this function
  event.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );
  a.dispatchEvent(event);
}
