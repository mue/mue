import { useState, useEffect } from 'react';
import { IconService } from 'utils/quicklinks';
import './smarticon.scss';

export const SmartIcon = ({ item, size = 32, fallbackChain, className = '' }) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [iconUrls, setIconUrls] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    const urls = IconService.getIconUrl(item, fallbackChain);
    setIconUrls(Array.isArray(urls) ? urls : [urls]);
    setCurrentIconIndex(0);
    setHasError(false);
    setShowPlaceholder(false);
  }, [item, fallbackChain]);

  const handleImageError = () => {
    if (currentIconIndex < iconUrls.length - 1) {
      setCurrentIconIndex((prev) => prev + 1);
      setHasError(false);
    } else {
      setHasError(true);
      setShowPlaceholder(true);
    }
  };

  if (item.iconType === 'emoji' && item.icon) {
    return (
      <div className={`smart-icon emoji ${className}`} style={{ fontSize: size }}>
        {item.icon}
      </div>
    );
  }

  if (item.iconType === 'letter' || showPlaceholder) {
    const avatar = IconService.generateLetterAvatar(item.name);
    return (
      <div
        className={`smart-icon letter-avatar ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: avatar.backgroundColor,
          fontSize: size * 0.5,
        }}
      >
        {avatar.letter}
      </div>
    );
  }

  const currentUrl = iconUrls[currentIconIndex];
  if (!currentUrl) {
    const avatar = IconService.generateLetterAvatar(item.name);
    return (
      <div
        className={`smart-icon letter-avatar ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: avatar.backgroundColor,
          fontSize: size * 0.5,
        }}
      >
        {avatar.letter}
      </div>
    );
  }

  return (
    <img
      src={currentUrl}
      alt={item.name}
      className={`smart-icon ${className}`}
      style={{ width: size, height: size }}
      onError={handleImageError}
      draggable={false}
      loading="lazy"
    />
  );
};
