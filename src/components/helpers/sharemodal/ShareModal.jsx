import { memo } from 'react';
import PropTypes from 'prop-types';
import variables from 'modules/variables';
import { MdClose, MdEmail, MdContentCopy } from 'react-icons/md';
import { FaTwitter, FaFacebookF } from 'react-icons/fa';
import { AiFillWechat } from 'react-icons/ai';
import { SiTencentqq } from 'react-icons/si';
import Tooltip from '../tooltip/Tooltip';
import { toast } from 'react-toastify';

import './sharemodal.scss';

function ShareModal({ modalClose, data }) {
  if (data.startsWith('https://cdn.')) {
    data = {
      url: data,
      name: 'this image',
    };
  } else if (data.startsWith('"')) {
    data = {
      url: data,
      name: 'this quote',
    };
  } else {
    data = {
      url: data,
      name: 'this marketplace item',
    };
  }

  const copyLink = () => {
    navigator.clipboard.writeText(data.url);
    toast(variables.getMessage('modals.share.copy_link'));
  };

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">{variables.getMessage('widgets.quote.share')}</span>
        <Tooltip title={variables.getMessage('modals.welcome.buttons.close')}>
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <div className="shareButtons">
        <Tooltip title="Twitter">
          <button
            onClick={() =>
              window
                .open(
                  `https://twitter.com/intent/tweet?text=Check out ${data.name} on @getmue: ${data.url}`,
                  '_blank',
                )
                .focus()
            }
          >
            <FaTwitter />
          </button>
        </Tooltip>
        <Tooltip title="Facebook">
          <button
            onClick={() =>
              window
                .open(`https://www.facebook.com/sharer/sharer.php?u=${data.url}`, '_blank')
                .focus()
            }
          >
            <FaFacebookF />
          </button>
        </Tooltip>
        <Tooltip title="Email">
          <button
            onClick={() =>
              window
                .open(
                  'mailto:email@example.com?subject=Check%20out%20this%20%on%20%Mue!&body=' +
                    data.data.name +
                    'on Mue: ' +
                    data,
                  '_blank',
                )
                .focus()
            }
          >
            <MdEmail />
          </button>
        </Tooltip>
        <Tooltip title="WeChat">
          <button
            onClick={() =>
              window
                .open(
                  `https://api.qrserver.com/v1/create-qr-code/?size=154x154&data=${data.url}`,
                  '_blank',
                )
                .focus()
            }
          >
            <AiFillWechat />
          </button>
        </Tooltip>
        <Tooltip title="Tencent QQ">
          <button
            onClick={() =>
              window
                .open(`http://connect.qq.com/widget/shareqq/index.html?url=${data.url}`, '_blank')
                .focus()
            }
          >
            <SiTencentqq />
          </button>
        </Tooltip>
      </div>
      <div className="copy">
        <input type="text" value={data.url} className="left field" readOnly />
        <Tooltip title={variables.getMessage('modals.share.copy_link')} placement="top">
          <button onClick={() => copyLink()}>
            <MdContentCopy />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

ShareModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
  data: PropTypes.string.isRequired,
};

export default memo(ShareModal);
