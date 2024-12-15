import React from 'react';
import { motion } from 'framer-motion';
import Clock from 'features/time/Clock';

const ClockPreview = ({ zoomLevel = 100 }) => {
  return (
    <div className="relative w-full h-[300px] bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-lg overflow-hidden grid place-items-center">
      <Clock isPreview={true} />
    </div>
  );
};

export { ClockPreview, ClockPreview as default };
