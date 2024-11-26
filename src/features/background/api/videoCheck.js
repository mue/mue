/**
 * If the URL starts with `data:video/` or ends with `.mp4`, `.webm`, or `.ogg`, then it's a video.
 * @param url - The URL of the file to be checked.
 * @returns A function that takes a url and returns a boolean.
 */
export default function videoCheck(url = '') {
  if (typeof url !== 'string') {
    return false;
  }
  return (
    url.startsWith('data:video/') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.ogg')
  );
}
