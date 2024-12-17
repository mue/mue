import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Search from 'features/search/Search';

const SearchPreview = ({ zoomLevel = 100 }) => {
  const searchEngine = localStorage.getItem('searchEngine') || 'duckduckgo';

  return (
    <AnimatePresence mode="crossfade">
      <motion.div
        className="absolute"
        key={`search-preview-${searchEngine}`}
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
        <Search isPreview={true} />
      </motion.div>
    </AnimatePresence>
  );
};

export { SearchPreview, SearchPreview as default };
