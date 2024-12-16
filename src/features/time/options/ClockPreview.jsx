import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Clock from 'features/time/Clock';

const ClockPreview = ({ zoomLevel = 100 }) => {
  const timeType = localStorage.getItem('timeType') || 'digital';
  const previewTime = new Date();
  previewTime.setHours(10, 10, 30);

  return (
    <AnimatePresence mode="crossfade">
      <motion.div
        className="absolute"
        key={`clock-preview-${timeType}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: zoomLevel / 100,
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 0.3, ease: 'anticipate' },
        }}
      >
        <Clock isPreview={true} staticTime={previewTime} />
      </motion.div>
    </AnimatePresence>
  );
};

export { ClockPreview, ClockPreview as default };
