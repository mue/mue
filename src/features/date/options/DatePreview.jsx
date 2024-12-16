import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DateWidget from 'features/date/Date';

const DatePreview = ({ zoomLevel = 100 }) => {
  const dateType = localStorage.getItem('dateType') || 'long';

  return (
    <AnimatePresence mode="crossfade">
      <motion.div
        className="absolute text-3xl"
        key={`date-preview-${dateType}`}
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
        <DateWidget isPreview={true} staticDate={new Date(2024, 2, 15)} />
      </motion.div>
    </AnimatePresence>
  );
};

export { DatePreview, DatePreview as default };
