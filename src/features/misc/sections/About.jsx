import variables from 'config/variables';
import { useState, useEffect } from 'react';
import { MdEmail, MdContactPage } from 'react-icons/md';
import { FaDiscord } from 'react-icons/fa';
import { SiGithubsponsors, SiOpencollective, SiX } from 'react-icons/si';
import { BiDonateHeart } from 'react-icons/bi';

import { Tooltip, Button } from 'components/Elements';

function About() {
  const [contributors, setContributors] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [curators, setCurators] = useState([]);

  const [update, setUpdate] = useState(
    variables.getMessage('settings:sections.about.version.checking_update'),
  );
  const [loading, setLoading] = useState(variables.getMessage('modals.main.loading'));

  const controller = new AbortController();
  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  const getGitHubData = async () => {
    let contributors, sponsors, photographers, curators, versionData;

    try {
      versionData = await (
        await fetch(
          variables.constants.GITHUB_URL +
            '/repos/' +
            variables.constants.ORG_NAME +
            '/' +
            variables.constants.REPO_NAME +
            '/releases',
          { signal: controller.signal },
        )
      ).json();

      contributors = await (
        await fetch(
          variables.constants.GITHUB_URL +
            '/repos/' +
            variables.constants.ORG_NAME +
            '/' +
            variables.constants.REPO_NAME +
            '/contributors',
          { signal: controller.signal },
        )
      ).json();

      sponsors = await (
        await fetch(variables.constants.SPONSORS_URL + '/list', {
          signal: controller.signal,
        })
      ).json().sponsors;

      photographers = await (
        await fetch(variables.constants.API_URL + '/images/photographers', {
          signal: controller.signal,
        })
      ).json();

      curators = (
        await (
          await fetch(variables.constants.API_URL + '/marketplace/curators', {
            signal: controller.signal,
          })
        ).json()
      ).data;
    } catch (e) {
      if (controller.signal.aborted === true) {
        return;
      }

      setUpdate(variables.getMessage('settings:sections.about.version.error.title'));
      setLoading(variables.getMessage('settings:sections.about.version.error.description'));
    }

    if (sponsors.length === 0) {
      sponsors = [{ handle: 'empty' }];
    }

    if (controller.signal.aborted === true) {
      return;
    }

    const newVersion = versionData[0].tag_name;

    let update = variables.getMessage('settings:sections.about.version.no_update');

    if (
      Number(variables.constants.VERSION.replaceAll('.', '')) <
      Number(newVersion.replaceAll('.', ''))
    ) {
      update = `${variables.getMessage(
        'settings:sections.about.version.update_available',
      )}: ${newVersion}`;
    }

    setContributors(contributors.filter((contributor) => !contributor.login.includes('bot')));
    setSponsors(sponsors);
    setUpdate(update);
    setPhotographers(photographers);
    setCurators(curators);
    setLoading(null);
  };

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      setUpdate(variables.getMessage('marketplace:offline.description'));
      setLoading(variables.getMessage('marketplace:offline.description'));
      return;
    }

    getGitHubData();
  }, []);

  return (
    <div className="modalInfoPage">
      <div className="settingsRow" style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexFlow: 'column', gap: '5px' }}>
          <img draggable={false} className="aboutLogo" src={'icons/mue_about.png'} alt="Logo" />
          <div className="aboutText">
            <span className="title">Mue, by Kaiso</span>
            <span className="subtitle">
              {variables.getMessage('settings:sections.about.version.title')}{' '}
              {variables.constants.VERSION}
            </span>
            <span className="subtitle">({update})</span>
          </div>
          <div>
            <span className="subtitle">
              Copyright 2018-
              {new Date().getFullYear()}{' '}
              <a
                className="link"
                href={
                  'https://github.com/' +
                  variables.constants.ORG_NAME +
                  '/' +
                  variables.constants.REPO_NAME +
                  '/graphs/contributors'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                The Mue Authors
              </a>
            </span>
            <br></br>
            <span className="subtitle">
              Copyright 2023-2024{' '}
              <a
                className="link"
                href="https://kaiso.one"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                Kaiso One Ltd
              </a>
            </span>
          </div>
          <span className="subtitle">Licensed under the BSD-3-Clause License</span>
          <span className="subtitle">
            <a
              href={variables.constants.PRIVACY_URL}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {variables.getMessage('welcome:sections.privacy.links.privacy_policy')}
            </a>
          </span>
        </div>
      </div>

      <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
        <span className="title">{variables.getMessage('settings:sections.about.contact_us')}</span>
        <div className="aboutContact">
          <Button
            type="linkButton"
            href="https://muetab.com/contact"
            icon={<MdContactPage />}
            label={variables.getMessage('settings:sections.about.form_button')}
          />
          <Button
            type="linkIconButton"
            href={'mailto:' + variables.constants.EMAIL}
            icon={<MdEmail />}
            tooltipTitle="Email"
          />
          <Button
            type="linkIconButton"
            href={'https://x.com/' + variables.constants.TWITTER_HANDLE}
            icon={<SiX />}
            tooltipTitle="X (Twitter)"
          />
          <Button
            type="linkIconButton"
            href={'https://discord.gg/' + variables.constants.DISCORD_SERVER}
            icon={<FaDiscord />}
            tooltipTitle="Discord"
          />
        </div>
      </div>

      <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
        <span className="title">{variables.getMessage('settings:sections.about.support_mue')}</span>
        <p>{variables.getMessage('settings:sections.about.support_subtitle')}</p>
        <div className="aboutContact">
          <Button
            type="linkButton"
            href={'https://opencollective.com/' + variables.constants.OPENCOLLECTIVE_USERNAME}
            icon={<BiDonateHeart />}
            label={variables.getMessage('settings:sections.about.support_donate')}
          />
          <Button
            type="linkIconButton"
            href={'https://github.com/sponsors/' + variables.constants.ORG_NAME}
            icon={<SiGithubsponsors />}
            tooltipTitle="Github Sponsors"
          />
          <Button
            type="linkIconButton"
            href={'https://opencollective.com/' + variables.constants.OPENCOLLECTIVE_USERNAME}
            icon={<SiOpencollective />}
            tooltipTitle="Open Collective"
          />
        </div>
      </div>

      <div
        className="settingsRow"
        style={{ flexFlow: 'column', alignItems: 'flex-start', minHeight: '70px' }}
      >
        <span className="title">
          {variables.getMessage('settings:sections.about.resources_used.title')}
        </span>
        <span className="subtitle">
          <a
            href="https://www.pexels.com"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pexels
          </a>
          ,{' '}
          <a href="https://unsplash.com" className="link" target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>{' '}
          ({variables.getMessage('settings:sections.about.resources_used.bg_images')})
        </span>
      </div>

      <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
        <span className="title">
          {variables.getMessage('settings:sections.about.contributors')}
        </span>
        <p>{loading}</p>
        <div className="contributorImages">
          {contributors.map(({ login, id }) => (
            <Tooltip title={login} key={login}>
              <a href={'https://github.com/' + login} target="_blank" rel="noopener noreferrer">
                <img
                  draggable={false}
                  src={'https://avatars.githubusercontent.com/u/' + id + '?s=128'}
                  alt={login}
                ></img>
              </a>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
        <span className="title">{variables.getMessage('settings:sections.about.supporters')}</span>
        <p>{loading}</p>
        <div className="contributorImages">
          {sponsors.map(({ handle, avatar }) => {
            if (handle === 'empty') {
              return <p>{variables.getMessage('settings:sections.about.no_supporters')}</p>;
            }

            return (
              <Tooltip title={handle} key={handle}>
                <a href={'https://github.com/' + handle} target="_blank" rel="noopener noreferrer">
                  <img draggable={false} src={avatar.split('?')[0] + '?s=128'} alt={handle}></img>
                </a>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <div
        className="settingsRow"
        style={{
          flexFlow: 'column',
          alignItems: 'flex-start',
          minHeight: '10px',
        }}
      >
        <span className="title">
          {variables.getMessage('settings:sections.about.photographers')}
        </span>
        {!!loading ? <p>{loading}</p> : <></>}
        <ul>
          {photographers.map(({ name, count }) => (
            <li key={name} className="subtitle-photographers">
              {name}
              <span> ({count} images)</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="settingsRow"
        style={{
          flexFlow: 'column',
          alignItems: 'flex-start',
          minHeight: '10px',
          borderBottom: '0',
        }}
      >
        <span className="title">{variables.getMessage('settings:sections.about.curators')}</span>
        {!!loading ? <p>{loading}</p> : <></>}
        <ul>
          {curators.map((name) => (
            <li key={name} className="subtitle-photographers">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { About as default, About };
