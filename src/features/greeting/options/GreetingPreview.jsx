import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Greeting from 'features/greeting/Greeting';

const GreetingPreview = ({ zoomLevel = 100 }) => {
  // Set a fixed time for preview (e.g. 10:30 AM)
  const previewTime = new Date();
  previewTime.setHours(10, 30, 0);

  return (
    <AnimatePresence mode="crossfade">
      <motion.div
        className="absolute text-3xl"
        key="greeting-preview"
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
        <Greeting isPreview={true} staticTime={previewTime} />
      </motion.div>
    </AnimatePresence>
  );
};

export { GreetingPreview, GreetingPreview as default };
