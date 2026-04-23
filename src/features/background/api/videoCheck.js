/**
 * Checks if the given URL or MIME type represents a video file.
 * Supports both URLs (data:video/, .mp4, .webm, .ogg) and MIME types (video/mp4, video/webm, video/ogg).
 * @param urlOrMimeType - The URL or MIME type to check.
 * @returns true if it's a video, false otherwise.
 */
export default function videoCheck(urlOrMimeType) {
  if (!urlOrMimeType) {
    return false;
  }

  return (
    urlOrMimeType.startsWith('data:video/') ||
    urlOrMimeType.startsWith('video/') ||
    urlOrMimeType.endsWith('.mp4') ||
    urlOrMimeType.endsWith('.webm') ||
    urlOrMimeType.endsWith('.ogg')
  );
}
