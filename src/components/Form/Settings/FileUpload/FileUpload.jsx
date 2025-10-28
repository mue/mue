import variables from 'config/variables';
import { memo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { compressAccurately, filetoDataURL } from 'image-conversion';
import videoCheck from 'features/background/api/videoCheck';

const FileUpload = memo(({ id, type, accept, loadFunction }) => {
  useEffect(() => {
    const fileInput = document.getElementById(id);
    if (!fileInput) return;

    const handleChange = (e) => {
      const reader = new FileReader();
      const file = e.target.files[0];

      if (type === 'settings') {
        reader.readAsText(file, 'UTF-8');
        reader.onload = (e) => {
          return loadFunction(e.target.result);
        };
      } else {
        // background upload
        const settings = {};

        Object.keys(localStorage).forEach((key) => {
          settings[key] = localStorage.getItem(key);
        });

        const settingsSize = new TextEncoder().encode(JSON.stringify(settings)).length;
        if (videoCheck(file.type) === true) {
          if (settingsSize + file.size > 4850000) {
            return toast(variables.getMessage('toasts.no_storage'));
          }

          return loadFunction(file);
        }

        compressAccurately(file, {
          size: 450,
          accuracy: 0.9,
        }).then(async (res) => {
          if (settingsSize + res.size > 4850000) {
            return toast(variables.getMessage('toasts.no_storage'));
          }

          loadFunction({
            target: {
              result: await filetoDataURL(res),
            },
          });
        });
      }
    };

    fileInput.onchange = handleChange;

    return () => {
      if (fileInput) {
        fileInput.onchange = null;
      }
    };
  }, [id, type, loadFunction]);

  return (
    <input
      id={id}
      type="file"
      style={{ display: 'none' }}
      accept={accept}
    />
  );
});

FileUpload.displayName = 'FileUpload';

export { FileUpload as default, FileUpload };
