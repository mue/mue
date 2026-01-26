import variables from 'config/variables';
import { memo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { compressAccurately, filetoDataURL } from 'image-conversion';
import videoCheck from 'features/background/api/videoCheck';

const FileUpload = memo(({ id, type, accept, loadFunction, multiple }) => {
  useEffect(() => {
    const fileInput = document.getElementById(id);
    if (!fileInput) return;

    const handleChange = (e) => {
      const files = Array.from(e.target.files);

      if (type === 'settings') {
        const reader = new FileReader();
        const file = files[0];
        reader.readAsText(file, 'UTF-8');
        reader.onload = (e) => {
          return loadFunction(e.target.result);
        };
      } else {
        // Pass files directly to loadFunction if it's a newer implementation
        if (typeof loadFunction === 'function' && loadFunction.length === 1) {
          loadFunction(files);
        } else {
          // Legacy background upload - handle multiple files
          const settings = {};

          Object.keys(localStorage).forEach((key) => {
            settings[key] = localStorage.getItem(key);
          });

          const settingsSize = new TextEncoder().encode(JSON.stringify(settings)).length;

          // Process each file
          files.forEach((file, index) => {
            if (videoCheck(file.type) === true) {
              if (settingsSize + file.size > 4850000) {
                return toast(variables.getMessage('toasts.no_storage'));
              }

              return loadFunction(file, index);
            }

            compressAccurately(file, {
              size: 450,
              accuracy: 0.9,
            }).then(async (res) => {
              if (settingsSize + res.size > 4850000) {
                return toast(variables.getMessage('toasts.no_storage'));
              }

              loadFunction(
                {
                  target: {
                    result: await filetoDataURL(res),
                  },
                },
                index,
              );
            });
          });
        }
      }
    };

    fileInput.onchange = handleChange;

    return () => {
      if (fileInput) {
        fileInput.onchange = null;
      }
    };
  }, [id, type, loadFunction, multiple]);

  return (
    <input
      id={id}
      type="file"
      style={{ display: 'none' }}
      accept={accept}
      multiple={multiple !== undefined ? multiple : type !== 'settings'}
    />
  );
});

FileUpload.displayName = 'FileUpload';

export { FileUpload as default, FileUpload };
