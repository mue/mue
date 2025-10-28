import variables from 'config/variables';
import { useState, useEffect, useRef } from 'react';
import { MdOutlineWifiOff } from 'react-icons/md';
import Modal from 'react-modal';

import Lightbox from '../../marketplace/components/Elements/Lightbox/Lightbox';

const Changelog = () => {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [date, setDate] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  
  const offlineMode = localStorage.getItem('offlineMode') === 'true';
  const controllerRef = useRef(new AbortController());
  const changelog = useRef();

  const parseMarkdown = (text) => {
    if (typeof text !== 'string') {
      throw new Error('Input must be a string');
    }

    // Replace markdown syntax
    text = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^## (.*$)/gm, '<span class="title">$1</span>')
      .replace(
        /((http|https):\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // resolve @ to github user link
      .replace(
        /@([a-zA-Z0-9-_]+)/g,
        '<a href="https://github.com/$1" target="_blank" class="changelogAt">@$1</a>',
      );

    // Replace list items
    text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');

    // Wrap list items in <ul></ul>
    text = text.replace(/((<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

    return text;
  };

  const getUpdate = async () => {
    const releases = await fetch(
      `https://api.github.com/repos/${variables.constants.ORG_NAME}/${variables.constants.REPO_NAME}/releases`,
      {
        signal: controllerRef.current.signal,
      },
    );

    if (controllerRef.current.signal.aborted === true) {
      return;
    }

    // get the release which tag_name is the same as the current version
    const data = await releases.json();
    let release = data.find((release) => release.tag_name === variables.constants.VERSION);

    if (!release) {
      release = data[0];
    }

    // request the changelog
    const res = await fetch(release.url, { signal: controllerRef.current.signal });

    if (res.status === 404) {
      setError(true);
      return;
    }

    if (controllerRef.current.signal.aborted === true) {
      return;
    }

    const changelog = await res.json();
    setTitle(changelog.name);
    setContent(parseMarkdown(changelog.body));
    setDate(new Date(changelog.published_at).toLocaleDateString());
  };

  useEffect(() => {
    if (navigator.onLine === false || offlineMode) {
      return;
    }

    getUpdate();

    return () => {
      // stop making requests
      controllerRef.current.abort();
    };
  }, []);

  const errorMessage = (msg) => {
    return (
      <div className="emptyItems">
        <div className="emptyMessage">{msg}</div>
      </div>
    );
  };

  if (navigator.onLine === false || offlineMode) {
    return errorMessage(
      <>
        <MdOutlineWifiOff />
        <h1>{variables.getMessage('modals.main.marketplace.offline.title')}</h1>
        <p className="description">
          {variables.getMessage('modals.main.marketplace.offline.description')}
        </p>
      </>,
    );
  }

  if (error === true) {
    return errorMessage(
      <>
        <MdOutlineWifiOff />
        <span className="title">{variables.getMessage('modals.main.error_boundary.title')}</span>
        <span className="subtitle">
          {variables.getMessage('modals.main.error_boundary.message')}
        </span>
      </>,
    );
  }

  if (!title) {
    return errorMessage(
      <div className="loaderHolder">
        <div id="loader"></div>
        <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
      </div>,
    );
  }

  return (
    <div className="modalInfoPage changelogtab" ref={changelog}>
      <span className="mainTitle">{title}</span>
      <span className="subtitle">Released on {date}</span>
      {image && (
        <img
          draggable={false}
          src={image}
          alt={title}
          className="updateImage"
        />
      )}
      <div className="updateChangelog" dangerouslySetInnerHTML={{ __html: content }} />
      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => setShowLightbox(false)}
        isOpen={showLightbox}
        className="Modal lightBoxModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <Lightbox
          modalClose={() => setShowLightbox(false)}
          img={lightboxImg}
        />
      </Modal>
    </div>
  );
};

export { Changelog as default, Changelog };
