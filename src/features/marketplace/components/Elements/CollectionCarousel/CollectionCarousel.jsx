import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'components/Elements';
import { MdOutlineOpenInNew, MdOutlineArrowForward } from 'react-icons/md';
import variables from 'config/variables';

const CollectionCarousel = ({ collections, collectionFunction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCollections, setSelectedCollections] = useState([]);

  const getRandomCollections = (collections, count) => {
    let shuffled = collections.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    setSelectedCollections(getRandomCollections(collections, 3));
  }, [collections]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedCollections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedCollections]);

  return (
    <div className="carousel">
      <AnimatePresence initial={false} custom={currentIndex} mode="wait">
        {selectedCollections.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ x: '50%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-50%', opacity: 1 }}
            transition={{ duration: 1 }}
            className="collection"
            style={
              selectedCollections[currentIndex]?.news
                ? { backgroundColor: selectedCollections[currentIndex]?.background_colour }
                : {
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), transparent, rgba(0, 0, 0, 0.7), rgba(0 ,0, 0, 0.9)), url('${selectedCollections[currentIndex]?.img}')`,
                  }
            }
          >
            <div className="content">
              <span className="title">{selectedCollections[currentIndex]?.display_name}</span>
              <span className="subtitle">{selectedCollections[currentIndex]?.description}</span>
            </div>
            {selectedCollections[currentIndex]?.news === true ? (
              <a
                className="btn-collection"
                href={selectedCollections[currentIndex]?.news_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {variables.getMessage('marketplace:learn_more')} <MdOutlineOpenInNew />
              </a>
            ) : (
              <Button
                type="collection"
                onClick={() => collectionFunction(selectedCollections[currentIndex]?.name)}
                icon={<MdOutlineArrowForward />}
                label={variables.getMessage('marketplace:explore_collection')}
                iconPlacement={'right'}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { CollectionCarousel as default, CollectionCarousel };
