import { useTime } from '../context/TimeContext';
import { usePreviewTime } from '../context/PreviewTimeContext';

export const useClockTime = (isPreview = false) => {
  // Always call both hooks to maintain hook order
  const previewContext = usePreviewTime();
  const liveContext = useTime();

  // Return the appropriate context based on isPreview
  return isPreview ? previewContext : liveContext;
};
