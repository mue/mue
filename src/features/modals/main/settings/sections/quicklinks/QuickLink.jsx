import variables from 'modules/variables';

import { MdEdit, MdCancel } from 'react-icons/md';

const QuickLink = ({ item, deleteLink, startEditLink }) => {
  let target,
    rel = null;
  if (localStorage.getItem('quicklinksnewtab') === 'true') {
    target = '_blank';
    rel = 'noopener noreferrer';
  }

  const useText = localStorage.getItem('quicklinksText') === 'true';

  if (useText) {
    return (
      <a
        className="quicklinkstext"
        onContextMenu={(e) => deleteLink(item.key, e)}
        href={item.url}
        target={target}
        rel={rel}
        draggable={false}
      >
        {item.name}
      </a>
    );
  }

  const img =
    item.icon ||
    'https://icon.horse/icon/ ' + item.url.replace('https://', '').replace('http://', '');

  return (
    <div className="messageMap">
      <div className="icon">
        <img
          src={img}
          alt={item.name}
          draggable={false}
          style={{ height: '30px', width: '30px' }}
        />
      </div>
      <div className="messageText">
        <div className="title">{item.name}</div>
        <div className="subtitle">
          <a className="quicklinknostyle" target="_blank" rel="noopener noreferrer" href={item.url}>
            {item.url}
          </a>
        </div>
      </div>
      <div>
        <div className="messageAction">
          <button className="deleteButton" onClick={() => startEditLink(item)}>
            {variables.getMessage('modals.main.settings.sections.quicklinks.edit')}
            <MdEdit />
          </button>
          <button className="deleteButton" onClick={(e) => deleteLink(item.key, e)}>
            {variables.getMessage('modals.main.marketplace.product.buttons.remove')}
            <MdCancel />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLink;
