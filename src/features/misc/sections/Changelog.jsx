import variables from 'config/variables';
import { useState, createRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import { MdOutlineWifiOff } from 'react-icons/md';

function Changelog() {
  const [title, setTitle] = useState(null);
  const [error, setError] = useState(false);
  const [content, setContent] = useState(null);
  const [date, setDate] = useState(null);

  const offlineMode = localStorage.getItem('offlineMode') === 'true';
  const changelog = createRef();

  const controller = new AbortController();
  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  const getUpdate = async () => {
    const releases = await fetch(
      `https://api.github.com/repos/${variables.constants.ORG_NAME}/${variables.constants.REPO_NAME}/releases`,
      {
        signal: controller.signal,
      },
    );

    if (controller.signal.aborted === true) {
      return;
    }

    // get the release which tag_name is the same as the current version
    const data = await releases.json();
    let release = data.find((release) => release.tag_name === variables.constants.VERSION);

    if (!release) {
      release = data[0];
    }

    // request the changelog
    const res = await fetch(release.url, { signal: controller.signal });

    if (res.status === 404) {
      setError(true);
      return;
    }

    if (controller.signal.aborted === true) {
      return;
    }

    const changelog = await res.json();
    setTitle(changelog.name);
    setContent(changelog.body);
    setDate(new Date(changelog.published_at).toLocaleDateString());
  };

  useEffect(() => {
    if (navigator.onLine === false || offlineMode) {
      return;
    }

    getUpdate();
  }, []);

  useEffect(() => {
    // stop making requests
    return () => controller.abort();
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
        <h1>{variables.getMessage('marketplace:offline.title')}</h1>
        <p className="description">{variables.getMessage('marketplace:offline.description')}</p>
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
    <div className="bg-modal-content-light dark:bg-modal-content-dark w-full ">
      <article className="rounded p-10 prose dark:prose-invert" ref={changelog}>
        <div>
          <h1 class="leading-tight mb-1">{title}</h1>
          <p class="leading-none mt-0">Published on {date}</p>
        </div>
        <Markdown options={{ overrides: { a: { props: { target: '_blank' } } } }}>
          {content}
        </Markdown>
      </article>
    </div>
  );
}

export { Changelog as default, Changelog };
