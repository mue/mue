import variables from 'config/variables';
import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  MdCancel,
  MdAddLink,
  MdAddPhotoAlternate,
  MdPersonalVideo,
  MdOutlineFileUpload,
  MdFolder,
  MdChevronLeft,
  MdChevronRight,
  MdDelete,
  MdInfo,
} from 'react-icons/md';
import EventBus from 'utils/eventbus';
import { compressAccurately, filetoDataURL } from 'image-conversion';
import videoCheck from '../api/videoCheck';
import {
  getAllBackgrounds,
  getAllBackgroundsWithMetadata,
  addBackground,
  deleteBackground,
  deleteMultipleBackgrounds,
  migrateFromLocalStorage,
  updateBackgroundMetadata,
} from 'utils/customBackgroundDB';
import {
  getImageDimensions,
  generateBlurHash,
  getDataUrlSize,
  getFileName,
  calculateStorageSize,
  calculateTotalStorageSize,
  formatBytes,
} from 'utils/imageMetadata';
import { generateBlurHashDataUrl } from '../api/blurHash';

import { Checkbox, FileUpload, Dropdown } from 'components/Form/Settings';
import { Tooltip, Button } from 'components/Elements';
import Modal from 'react-modal';

import CustomURLModal from './CustomURLModal';
import FolderTaggingModal from './FolderTaggingModal';

const CustomSettings = memo(() => {
  const [customBackground, setCustomBackground] = useState([]);
  const [customURLModal, setCustomURLModal] = useState(false);
  const [folderTaggingModal, setFolderTaggingModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [sortBy, setSortBy] = useState(localStorage.getItem('customImageSort') || 'date_desc');
  const [storageQuotaModal, setStorageQuotaModal] = useState(false);
  const [storageQuota, setStorageQuota] = useState({ usage: 0, quota: 0 });
  const customDnd = useRef(null);
  const dragCounter = useRef(0);

  // IndexedDB typically has 50MB+ quota, we'll check dynamically
  const FALLBACK_STORAGE_LIMIT = 50000000; // 50MB fallback if API unavailable

  // Fetch storage quota
  useEffect(() => {
    const fetchQuota = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          setStorageQuota({
            usage: estimate.usage || 0,
            quota: estimate.quota || FALLBACK_STORAGE_LIMIT,
          });
        } catch (error) {
          console.warn('Could not get storage estimate:', error);
          setStorageQuota({ usage: 0, quota: FALLBACK_STORAGE_LIMIT });
        }
      } else {
        setStorageQuota({ usage: 0, quota: FALLBACK_STORAGE_LIMIT });
      }
    };
    fetchQuota();
  }, [customBackground]);

  // Load backgrounds from IndexedDB on mount
  useEffect(() => {
    const loadBackgrounds = async () => {
      try {
        // Try migration first
        await migrateFromLocalStorage();

        // Load from IndexedDB
        const backgrounds = await getAllBackgroundsWithMetadata();
        setCustomBackground(backgrounds);

        // Backfill missing metadata for existing images
        backgrounds.forEach(async (bg) => {
          if (!bg.dimensions && bg.url && !videoCheck(bg.url)) {
            try {
              const dimensions = await getImageDimensions(bg.url);
              const blurHash = await generateBlurHash(bg.url);
              await updateBackgroundMetadata(bg.id, { dimensions, blurHash });
              // Reload backgrounds to show updated metadata
              const updatedBackgrounds = await getAllBackgroundsWithMetadata();
              setCustomBackground(updatedBackgrounds);
            } catch (error) {
              console.warn('Could not extract metadata for existing image:', error);
            }
          }
        });
      } catch (error) {
        console.error('Error loading backgrounds:', error);
        toast(variables.getMessage('toasts.error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadBackgrounds();
  }, []);

  const handleCustomBackground = useCallback(
    async (file, dataUrl, metadata, skipRefresh = false) => {
      try {
        const backgroundData = {
          url: dataUrl,
          name: metadata.name,
          uploadDate: Date.now(),
          dimensions: metadata.dimensions,
          fileSize: metadata.fileSize,
          folder: metadata.folder || '',
          blurHash: metadata.blurHash,
        };

        await addBackground(backgroundData);

        // Reload from IndexedDB to get the latest state and update React state
        const backgrounds = await getAllBackgroundsWithMetadata();
        setCustomBackground(backgrounds);

        try {
          localStorage.setItem('customBackground', JSON.stringify(backgrounds.map((bg) => bg.url)));
        } catch (_quotaError) {
          console.warn('localStorage quota exceeded, storing count only');
          localStorage.setItem('customBackgroundCount', backgrounds.length.toString());
        }

        // Only emit refresh if not part of a batch upload
        if (!skipRefresh) {
          EventBus.emit('refresh', 'background');
        }
      } catch (error) {
        console.error('Error saving background:', error);
        toast(variables.getMessage('toasts.error'));
      }
    },
    [],
  );

  const processImageFile = async (file, folderName = '') => {
    // Calculate actual storage from existing backgrounds
    const storageSize = customBackground.reduce((total, bg) => {
      if (bg.url && bg.url.startsWith('data:')) {
        return total + getDataUrlSize(bg.url);
      }
      return total;
    }, 0);

    const availableQuota = storageQuota.quota || FALLBACK_STORAGE_LIMIT;

    // Request persistent storage if approaching limit (90%)
    if (storageSize / availableQuota > 0.9 && navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        if (isPersisted) {
          console.log('Storage persistence granted');
        }
      } catch (error) {
        console.warn('Could not request storage persistence:', error);
      }
    }

    if (videoCheck(file.type)) {
      if (storageSize + file.size > availableQuota) {
        throw new Error('no_storage');
      }

      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve({
            dataUrl: reader.result,
            metadata: {
              name: getFileName(file, customBackground.length),
              dimensions: null,
              fileSize: file.size,
              folder: folderName,
              blurHash: null,
            },
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else {
      // Compress image
      const compressed = await compressAccurately(file, {
        size: 450,
        accuracy: 0.9,
      });

      const availableQuota = storageQuota.quota || FALLBACK_STORAGE_LIMIT;
      if (storageSize + compressed.size > availableQuota) {
        throw new Error('no_storage');
      }

      const dataUrl = await filetoDataURL(compressed);

      // Generate metadata in parallel
      const [dimensions, blurHash] = await Promise.all([
        getImageDimensions(dataUrl),
        generateBlurHash(dataUrl).catch(() => null), // Don't fail if blur hash fails
      ]);

      return {
        dataUrl,
        metadata: {
          name: getFileName(file, customBackground.length),
          dimensions,
          fileSize: getDataUrlSize(dataUrl),
          folder: folderName,
          blurHash,
        },
      };
    }
  };

  const handleBatchUpload = async (files, folderName = '') => {
    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await processImageFile(files[i], folderName);
        // Skip refresh during batch upload to prevent background flashing
        await handleCustomBackground(files[i], result.dataUrl, result.metadata, true);
        setUploadProgress({ current: i + 1, total: files.length });
      } catch (error) {
        if (error.message === 'no_storage') {
          toast(variables.getMessage('toasts.no_storage'));
          break;
        }
        errors.push(files[i].name);
      }
    }

    if (errors.length > 0) {
      toast(variables.getMessage('toasts.error') + `: ${errors.join(', ')}`);
    }

    // Emit refresh once after all images are uploaded
    EventBus.emit('refresh', 'background');

    setIsUploading(false);
    setUploadProgress({ current: 0, total: 0 });
  };

  const handleFolderTagging = async (folderName) => {
    setFolderTaggingModal(false);
    await handleBatchUpload(pendingFiles, folderName);
    setPendingFiles([]);
  };

  const modifyCustomBackground = useCallback(async (type, index) => {
    try {
      if (type === 'add') {
        await addBackground('');
      } else {
        await deleteBackground(index);
      }

      // Reload from IndexedDB to get the latest state
      const backgrounds = await getAllBackgroundsWithMetadata();
      setCustomBackground(backgrounds);

      // Store in localStorage with quota handling
      try {
        localStorage.setItem('customBackground', JSON.stringify(backgrounds.map((bg) => bg.url)));
      } catch (_quotaError) {
        console.warn('localStorage quota exceeded, storing count only');
        localStorage.setItem('customBackgroundCount', backgrounds.length.toString());
      }

      EventBus.emit('refresh', 'background');
    } catch (error) {
      console.error('Error modifying background:', error);
      toast(variables.getMessage('toasts.error'));
    }
  }, []);

  const handleBatchDelete = async () => {
    if (selectedImages.size === 0) {
      return;
    }

    try {
      const indices = Array.from(selectedImages).sort((a, b) => b - a);
      await deleteMultipleBackgrounds(indices);

      // Reload from IndexedDB
      const backgrounds = await getAllBackgroundsWithMetadata();
      setCustomBackground(backgrounds);
      setSelectedImages(new Set());

      // Update localStorage
      try {
        localStorage.setItem('customBackground', JSON.stringify(backgrounds.map((bg) => bg.url)));
      } catch (_quotaError) {
        localStorage.setItem('customBackgroundCount', backgrounds.length.toString());
      }

      EventBus.emit('refresh', 'background');
      toast(variables.getMessage('toasts.deleted'));
    } catch (error) {
      console.error('Error batch deleting:', error);
      toast(variables.getMessage('toasts.error'));
    }
  };

  const toggleImageSelection = (index) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedImages(newSelection);
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    localStorage.setItem('customImageSort', sortOption);
  };

  const uploadCustomBackground = useCallback(() => {
    document.getElementById('bg-input').click();
  }, []);

  const addCustomURL = useCallback(
    async (e) => {
      // regex: https://ihateregex.io/expr/url/
      const urlRegex =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b([-a-zA-Z0-9()!@:%_.~#?&=]*)/;
      if (urlRegex.test(e) === false) {
        return setUrlError(variables.getMessage('widgets.quicklinks.url_error'));
      }

      setCustomURLModal(false);

      try {
        // Extract filename from URL
        const urlParts = e.split('/');
        const filename = urlParts[urlParts.length - 1].split('?')[0] || 'Remote Image';

        // Try to extract metadata from the remote image
        let dimensions = null;
        let blurHash = null;
        try {
          dimensions = await getImageDimensions(e);
          blurHash = await generateBlurHash(e);
        } catch (metadataError) {
          console.warn('Could not extract metadata from remote image:', metadataError);
        }

        const backgroundData = {
          url: e,
          name: filename,
          uploadDate: Date.now(),
          dimensions,
          fileSize: null, // Cannot determine file size for remote URLs without fetching
          folder: '',
          blurHash,
        };

        await addBackground(backgroundData);
        const backgrounds = await getAllBackgroundsWithMetadata();
        setCustomBackground(backgrounds);
      } catch (error) {
        console.error('Error adding URL:', error);
        toast(variables.getMessage('toasts.error'));
      }

      try {
        localStorage.setItem(
          'customBackground',
          JSON.stringify(updatedBackgrounds.map((bg) => bg.url)),
        );
      } catch (_quotaError) {
        localStorage.setItem('customBackgroundCount', updatedBackgrounds.length.toString());
      }

      EventBus.emit('refresh', 'background');
    },
    [customBackground.length],
  );

  const handleFileInputChange = async (files) => {
    if (files.length > 1) {
      // Multiple files - show tagging modal
      setPendingFiles(files);
      setFolderTaggingModal(true);
    } else {
      // Single file - upload directly
      await handleBatchUpload(files, '');
    }
  };

  // Sorted backgrounds
  const sortedBackgrounds = [...customBackground].sort((a, b) => {
    switch (sortBy) {
      case 'date_asc':
        return a.uploadDate - b.uploadDate;
      case 'date_desc':
        return b.uploadDate - a.uploadDate;
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name_desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'size_asc':
        return (a.fileSize || 0) - (b.fileSize || 0);
      case 'size_desc':
        return (b.fileSize || 0) - (a.fileSize || 0);
      default:
        return 0;
    }
  });

  // Calculate storage usage from actual background data
  const storageUsed = customBackground.reduce((total, bg) => {
    // Calculate size of the data URL
    if (bg.url && bg.url.startsWith('data:')) {
      return total + getDataUrlSize(bg.url);
    }
    return total;
  }, 0);
  const availableStorageLimit = storageQuota.quota || FALLBACK_STORAGE_LIMIT;
  const storagePercent = (storageUsed / availableStorageLimit) * 100;
  const totalStorageUsed = calculateTotalStorageSize();
  const TOTAL_STORAGE_LIMIT = 5242880; // 5MB total localStorage limit (browser default)

  useEffect(() => {
    const dnd = customDnd.current;
    if (!dnd) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = Array.from(e.dataTransfer.files);

      if (files.length === 0) {
        return;
      }

      if (files.length > 1) {
        // Multiple files - show tagging modal
        setPendingFiles(files);
        setFolderTaggingModal(true);
      } else {
        // Single file - upload directly
        await handleBatchUpload(files, '');
      }
    };

    dnd.ondragover = handleDragOver;
    dnd.ondragenter = handleDragEnter;
    dnd.ondragleave = handleDragLeave;
    dnd.ondrop = handleDrop;

    return () => {
      if (dnd) {
        dnd.ondragover = null;
        dnd.ondragenter = null;
        dnd.ondragleave = null;
        dnd.ondrop = null;
      }
    };
  }, [customBackground.length, handleBatchUpload]);

  const hasVideo = sortedBackgrounds.filter((bg) => bg && videoCheck(bg.url)).length > 0;

  if (isLoading) {
    return (
      <div className="photosEmpty">
        <div className="loaderHolder">
          <div id="loader"></div>
          <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
        </div>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="photosEmpty">
        <div className="loaderHolder">
          <div id="loader"></div>
          <span className="subtitle">
            {variables.getMessage('modals.main.settings.sections.background.source.uploading', {
              current: uploadProgress.current,
              total: uploadProgress.total,
            })}
          </span>
          <span className="subtitle">
            {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        ref={customDnd}
        style={
          isDragging
            ? {
                outline: '2px dashed #ff5c25',
                outlineOffset: '-2px',
                backgroundColor: 'rgba(255, 92, 37, 0.1)',
                transition: 'all 0.2s ease',
              }
            : {}
        }
      >
        <div className="imagesTopBar">
          <div className="imagesTopBarTitle">
            <MdAddPhotoAlternate />
            <div>
              <span className="title">
                {variables.getMessage(
                  'modals.main.settings.sections.background.source.custom_title',
                )}
              </span>
              <span className="subtitle">
                {variables.getMessage(
                  'modals.main.settings.sections.background.source.custom_description',
                )}
              </span>
            </div>
          </div>
          <div className="topbarbuttons">
            <Button
              type="settings"
              onClick={uploadCustomBackground}
              icon={<MdOutlineFileUpload />}
              label={variables.getMessage('modals.main.settings.sections.background.source.upload')}
            />
          </div>
        </div>

        <div className="imagesControlBar">
          <div className="controlBarLeft">
            <span className="image-count">
              {customBackground.length} {customBackground.length === 1 ? 'image' : 'images'}
              <span className="storage-info">
                {' '}
                · {formatBytes(storageUsed)} / {formatBytes(availableStorageLimit)}
                {storagePercent > 80 && navigator.storage && navigator.storage.persist && (
                  <Tooltip title="Request persistent storage to prevent browser from automatically clearing your images">
                    <button
                      className="request-storage-link"
                      onClick={async () => {
                        try {
                          const isPersisted = await navigator.storage.persist();
                          if (isPersisted) {
                            toast(
                              'Persistent storage granted - your images are protected from eviction',
                            );
                          } else {
                            toast(
                              'Persistent storage denied - images may be cleared if storage is low',
                            );
                          }
                        } catch (error) {
                          console.error('Storage request error:', error);
                          toast('Could not request persistent storage');
                        }
                      }}
                    >
                      Protect images
                    </button>
                  </Tooltip>
                )}
              </span>
            </span>
            <span className="selection-separator">·</span>
            {selectedImages.size > 0 ? (
              <>
                <span className="selected-count">{selectedImages.size} selected</span>
                <button className="delete-link" onClick={handleBatchDelete}>
                  Delete
                </button>
                {selectedImages.size < customBackground.length && (
                  <button
                    className="select-all-link"
                    onClick={() => {
                      const allIndices = new Set(customBackground.map((_, i) => i));
                      setSelectedImages(allIndices);
                    }}
                  >
                    Select all
                  </button>
                )}
                {selectedImages.size === customBackground.length && (
                  <button className="select-all-link" onClick={() => setSelectedImages(new Set())}>
                    Deselect all
                  </button>
                )}
              </>
            ) : (
              customBackground.length > 0 && (
                <button
                  className="select-all-link"
                  onClick={() => {
                    const allIndices = new Set(customBackground.map((_, i) => i));
                    setSelectedImages(allIndices);
                  }}
                >
                  Select all
                </button>
              )
            )}
          </div>
          <div className="controlBarRight">
            <Dropdown
              name="customImageSort"
              category="customImageSort"
              onChange={handleSort}
              items={[
                {
                  value: 'date_desc',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.sort.date_newest',
                  ),
                },
                {
                  value: 'date_asc',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.sort.date_oldest',
                  ),
                },
                {
                  value: 'name_asc',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.sort.name_asc',
                  ),
                },
                {
                  value: 'name_desc',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.sort.name_desc',
                  ),
                },
                {
                  value: 'size_asc',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.sort.size_small',
                  ),
                },
                {
                  value: 'size_desc',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.sort.size_large',
                  ),
                },
              ]}
            />
          </div>
        </div>

        <div className="dropzone-content">
          {sortedBackgrounds.length > 0 ? (
            <div className={`images-grid ${selectedImages.size > 0 ? 'selection-mode' : ''}`}>
              {sortedBackgrounds.map((bg, index) => {
                const originalIndex = customBackground.findIndex((item) => item === bg);
                const isVideo = bg && videoCheck(bg.url);

                return (
                  <div
                    key={originalIndex}
                    className="image-card"
                    onClick={(e) => {
                      // Only select if clicking the card itself, not navigation buttons
                      if (!e.target.closest('.image-nav-buttons')) {
                        toggleImageSelection(originalIndex);
                      }
                    }}
                  >
                    <div className="image-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedImages.has(originalIndex)}
                        onChange={() => toggleImageSelection(originalIndex)}
                      />
                    </div>
                    <div className="image-preview">
                      {bg.blurHash &&
                        !isVideo &&
                        (() => {
                          const blurHashDataUrl = generateBlurHashDataUrl(bg.blurHash, 32, 32);
                          return blurHashDataUrl ? (
                            <div
                              className="blur-placeholder"
                              style={{
                                backgroundImage: `url(${blurHashDataUrl})`,
                                filter: 'blur(20px)',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 0,
                              }}
                            />
                          ) : null;
                        })()}
                      {isVideo ? (
                        <div className="video-icon-wrapper">
                          <MdPersonalVideo className="customvideoicon" />
                        </div>
                      ) : (
                        <img
                          alt={bg.name || 'Custom background'}
                          src={bg.url}
                          loading="lazy"
                          style={{ position: 'relative', zIndex: 1 }}
                        />
                      )}
                      <div className="image-nav-buttons">
                        <button
                          className="nav-button nav-prev"
                          onClick={() => {
                            if (index > 0) {
                              const prevBg = sortedBackgrounds[index - 1];
                              EventBus.emit('refresh', 'background', prevBg.url);
                            }
                          }}
                          disabled={index === 0}
                        >
                          <MdChevronLeft />
                        </button>
                        <button
                          className="nav-button nav-next"
                          onClick={() => {
                            if (index < sortedBackgrounds.length - 1) {
                              const nextBg = sortedBackgrounds[index + 1];
                              EventBus.emit('refresh', 'background', nextBg.url);
                            }
                          }}
                          disabled={index === sortedBackgrounds.length - 1}
                        >
                          <MdChevronRight />
                        </button>
                      </div>
                    </div>
                    <div className="image-metadata">
                      <span className="image-name" title={bg.name}>
                        {bg.name || 'Unnamed'}
                      </span>
                      <div className="image-details">
                        {bg.dimensions && (
                          <span className="detail">
                            {bg.dimensions.width} × {bg.dimensions.height}
                          </span>
                        )}
                        {bg.fileSize && <span className="detail">{formatBytes(bg.fileSize)}</span>}
                        {bg.folder && <span className="detail folder-tag">{bg.folder}</span>}
                      </div>
                    </div>
                    <Tooltip
                      title={variables.getMessage(
                        'modals.main.settings.sections.background.source.remove',
                      )}
                    >
                      <button
                        className="delete-button"
                        onClick={() => modifyCustomBackground('remove', originalIndex)}
                      >
                        <MdCancel />
                      </button>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="photosEmpty">
              <div className="emptyNewMessage">
                <MdAddPhotoAlternate />
                <span className="title">
                  {variables.getMessage(
                    'modals.main.settings.sections.background.source.drop_to_upload',
                  )}
                </span>
                <span className="subtitle">
                  {variables.getMessage('modals.main.settings.sections.background.source.formats', {
                    list: 'jpeg, png, webp, webm, gif, mp4, webm, ogg',
                  })}
                </span>
                <Button
                  type="settings"
                  onClick={uploadCustomBackground}
                  icon={<MdFolder />}
                  label={variables.getMessage(
                    'modals.main.settings.sections.background.source.select',
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <FileUpload
        id="bg-input"
        accept="image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg"
        multiple
        loadFunction={async (files) => {
          await handleFileInputChange(files);
        }}
      />

      {hasVideo && (
        <>
          <Checkbox
            name="backgroundVideoLoop"
            text={variables.getMessage(
              'modals.main.settings.sections.background.source.loop_video',
            )}
          />
          <Checkbox
            name="backgroundVideoMute"
            text={variables.getMessage(
              'modals.main.settings.sections.background.source.mute_video',
            )}
          />
        </>
      )}

      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => setCustomURLModal(false)}
        isOpen={customURLModal}
        className="Modal resetmodal mainModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <CustomURLModal
          modalClose={addCustomURL}
          urlError={urlError}
          modalCloseOnly={() => setCustomURLModal(false)}
        />
      </Modal>

      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => {
          setFolderTaggingModal(false);
          setPendingFiles([]);
        }}
        isOpen={folderTaggingModal}
        className="Modal resetmodal mainModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <FolderTaggingModal
          files={pendingFiles}
          onConfirm={handleFolderTagging}
          onCancel={() => {
            setFolderTaggingModal(false);
            setPendingFiles([]);
          }}
        />
      </Modal>

      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => setStorageQuotaModal(false)}
        isOpen={storageQuotaModal}
        className="Modal resetmodal mainModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <div className="smallModal">
          <div className="shareHeader">
            <span className="title">
              {variables.getMessage('modals.main.settings.sections.background.source.storage_info')}
            </span>
            <button className="closeModal" onClick={() => setStorageQuotaModal(false)}>
              <MdCancel />
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            <p className="subtitle">
              {variables.getMessage(
                'modals.main.settings.sections.background.source.storage_description',
              )}
            </p>
            <div style={{ marginTop: '20px' }}>
              <p className="subtitle" style={{ fontWeight: '600', marginBottom: '8px' }}>
                Custom Backgrounds
              </p>
              <p className="subtitle">
                {formatBytes(storageUsed)} / {formatBytes(availableStorageLimit)} (
                {Math.round(storagePercent)}%)
              </p>
            </div>
            <div style={{ marginTop: '15px' }}>
              <p className="subtitle" style={{ fontWeight: '600', marginBottom: '8px' }}>
                Total localStorage Usage
              </p>
              <p className="subtitle">
                {formatBytes(totalStorageUsed)} / {formatBytes(TOTAL_STORAGE_LIMIT)} (
                {Math.round((totalStorageUsed / TOTAL_STORAGE_LIMIT) * 100)}%)
              </p>
              <p className="subtitle" style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
                Includes all Mue settings and custom images
              </p>
            </div>
          </div>
          <div className="resetFooter">
            <Button
              type="settings"
              onClick={() => setStorageQuotaModal(false)}
              label={variables.getMessage('modals.main.settings.buttons.close')}
            />
          </div>
        </div>
      </Modal>
    </>
  );
});

CustomSettings.displayName = 'CustomSettings';

export default CustomSettings;
