import variables from 'modules/variables';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { compressAccurately, filetoDataURL } from 'image-conversion';
import { videoCheck } from 'modules/helpers/background/widget';

class FileUpload extends PureComponent {
  componentDidMount() {
    document.getElementById(this.props.id).onchange = (e) => {
      const reader = new FileReader();
      const file = e.target.files[0];

      if (this.props.type === 'settings') {
        reader.readAsText(file, 'UTF-8');
        reader.onload = (e) => {
          return this.props.loadFunction(e.target.result);
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

          return this.props.loadFunction(file);
        }

        compressAccurately(file, {
          size: 450,
          accuracy: 0.9,
        }).then(async (res) => {
          if (settingsSize + res.size > 4850000) {
            return toast(variables.getMessage('toasts.no_storage'));
          }

          this.props.loadFunction({
            target: {
              result: await filetoDataURL(res),
            },
          });
        });
      }
    };
  }

  render() {
    return (
      <input
        id={this.props.id}
        type="file"
        style={{ display: 'none' }}
        accept={this.props.accept}
      />
    );
  }
}

FileUpload.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  loadFunction: PropTypes.func.isRequired,
  accept: PropTypes.string,
};

export default FileUpload;
