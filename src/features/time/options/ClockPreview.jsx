import React from 'react';
import Clock from 'features/time/Clock';

const ClockPreview = ({ zoomLevel = 100 }) => {
  // Create a static time - 10:10:30
  const previewTime = new Date();
  previewTime.setHours(10, 10, 30);

  return (
    <div className="relative w-full h-[300px] bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-lg overflow-hidden grid place-items-center">
      <Clock isPreview={true} staticTime={previewTime} />
    </div>
  );
};

export { ClockPreview, ClockPreview as default };
