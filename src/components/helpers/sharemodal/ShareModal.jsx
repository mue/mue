import variables from 'modules/variables';
import { MdClose, MdEmail, MdContentCopy } from 'react-icons/md';
import { FaTwitter, FaFacebookF } from 'react-icons/fa';
import { AiFillWechat } from 'react-icons/ai';
import { SiTencentqq } from 'react-icons/si';
import Tooltip from '../tooltip/Tooltip';
import { toast } from 'react-toastify';

import './sharemodal.scss';

export default function ShareModal({ modalClose, data, type }) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);
  const url = variables.constants.MARKETPLACE_URL + '/share/' + btoa(data.api_name);

  const copyLink = () => {
    navigator.clipboard.writeText(data);
    toast('Link copied!');
  };

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">Share</span>
        <Tooltip title="Close">
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <div className="buttons">
        <Tooltip title="Twitter">
          <button
            onClick={() =>
              window
                .open(
                  `https://twitter.com/intent/tweet?text=Check out ${data.data.name} on @getmue marketplace: ${data}`,
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
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${data}`, '_blank').focus()
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
                  'mailto:email@example.com?subject=Check%20out%20this%20Mue%20addon!&body=' +
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
        {/* i think that wechat has no actual share function outside of qrcodes, as the only example of a share to wechat button i've seen used this api
         * this requires some investigating before we deploy to production
         */}
        <Tooltip title="WeChat">
          <button
            onClick={() =>
              window
                .open(
                  `https://api.qrserver.com/v1/create-qr-code/?size=154x154&data=${data}`,
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
                .open(`http://connect.qq.com/widget/shareqq/index.html?url=${data}`, '_blank')
                .focus()
            }
          >
            <SiTencentqq />
          </button>
        </Tooltip>
      </div>
      <div className="copy">
        <input type="text" value={data} className="left field" readOnly />
        <Tooltip title="Copy link" placement="top">
          <button onClick={() => copyLink()}>
            <MdContentCopy />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
