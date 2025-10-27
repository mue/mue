import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdEmail, MdContactPage } from 'react-icons/md';
import { FaDiscord } from 'react-icons/fa';
import { SiGithubsponsors, SiOpencollective, SiX } from 'react-icons/si';
import { BiDonateHeart } from 'react-icons/bi';

import { Tooltip, Button } from 'components/Elements';
import other_contributors from 'utils/data/other_contributors.json';

class About extends PureComponent {
  constructor() {
    super();
    this.state = {
      contributors: [],
      sponsors: [],
      other_contributors: [],
      photographers: [],
      curators: [],
      update: variables.getMessage('modals.main.settings.sections.about.version.checking_update'),
      loading: variables.getMessage('modals.main.loading'),
    };
    this.controller = new AbortController();
  }

  async getGitHubData() {
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
          { signal: this.controller.signal },
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
          { signal: this.controller.signal },
        )
      ).json();
      sponsors = (
        await (
          await fetch(variables.constants.SPONSORS_URL + '/list', {
            signal: this.controller.signal,
          })
        ).json()
      ).sponsors;
      photographers = await (
        await fetch(variables.constants.API_URL + '/images/photographers', {
          signal: this.controller.signal,
        })
      ).json();
      curators = (
        await (
          await fetch(variables.constants.API_URL + '/marketplace/curators', {
            signal: this.controller.signal,
          })
        ).json()
      ).data;
    } catch {
      if (this.controller.signal.aborted === true) {
        return;
      }

      return this.setState({
        update: variables.getMessage('modals.main.settings.sections.about.version.error.title'),
        loading: variables.getMessage(
          'modals.main.settings.sections.about.version.error.description',
        ),
      });
    }

    if (sponsors.length === 0) {
      sponsors = [{ handle: 'empty' }];
    }

    if (this.controller.signal.aborted === true) {
      return;
    }

    const newVersion = versionData[0].tag_name;

    let update = variables.getMessage('modals.main.settings.sections.about.version.no_update');
    if (
      Number(variables.constants.VERSION.replaceAll('.', '')) <
      Number(newVersion.replaceAll('.', ''))
    ) {
      update = `${variables.getMessage(
        'modals.main.settings.sections.about.version.update_available',
      )}: ${newVersion}`;
    }

    this.setState({
      // exclude bots
      contributors: contributors.filter((contributor) => !contributor.login.includes('bot')),
      sponsors,
      update,
      other_contributors,
      photographers,
      curators,
      loading: null,
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      this.setState({
        update: variables.getMessage('modals.main.marketplace.offline.description'),
        loading: variables.getMessage('modals.main.marketplace.offline.description'),
      });
      return;
    }

    this.getGitHubData();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    return (
      <div className="modalInfoPage">
        <div className="settingsRow" style={{ justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexFlow: 'column', gap: '5px' }}>
            <img
              draggable={false}
              className="aboutLogo"
              src={'src/assets/icons/mue_about.png'}
              alt="Logo"
            />
            <div className="aboutText">
              <span className="title">Mue, by Kaiso</span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.about.version.title')}{' '}
                {variables.constants.VERSION}
              </span>
              <span className="subtitle">({this.state.update})</span>
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
                {variables.getMessage('modals.welcome.sections.privacy.links.privacy_policy')}
              </a>
            </span>
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.contact_us')}
          </span>
          <div className="aboutContact">
            <Button
              type="linkButton"
              href="https://muetab.com/contact"
              icon={<MdContactPage />}
              label={variables.getMessage('modals.main.settings.sections.about.form_button')}
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
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.support_mue')}
          </span>
          <p>{variables.getMessage('modals.main.settings.sections.about.support_subtitle')}</p>
          <div className="aboutContact">
            <Button
              type="linkButton"
              href={'https://opencollective.com/' + variables.constants.OPENCOLLECTIVE_USERNAME}
              icon={<BiDonateHeart />}
              label={variables.getMessage('modals.main.settings.sections.about.support_donate')}
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
            {variables.getMessage('modals.main.settings.sections.about.resources_used.title')}
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
            <a
              href="https://unsplash.com"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>{' '}
            ({variables.getMessage('modals.main.settings.sections.about.resources_used.bg_images')})
          </span>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.contributors')}
          </span>
          <p>{this.state.loading}</p>
          <div className="contributorImages">
            {this.state.contributors.map(({ login, id }) => (
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
            {
              // for those who contributed without opening a pull request
              this.state.other_contributors.map(({ login, avatar_url }) => (
                <Tooltip title={login} key={login}>
                  <a href={'https://github.com/' + login} target="_blank" rel="noopener noreferrer">
                    <img draggable={false} src={avatar_url + '&s=128'} alt={login}></img>
                  </a>
                </Tooltip>
              ))
            }
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.supporters')}
          </span>
          <p>{this.state.loading}</p>
          <div className="contributorImages">
            {this.state.sponsors.map(({ handle, avatar }) => {
              if (handle === 'empty') {
                return (
                  <p key="empty">
                    {variables.getMessage('modals.main.settings.sections.about.no_supporters')}
                  </p>
                );
              }

              return (
                <Tooltip title={handle} key={handle}>
                  <a
                    href={'https://github.com/' + handle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img draggable={false} src={avatar.split('?')[0] + '?s=128'} alt={handle}></img>
                  </a>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <div
          className="settingsRow"
          style={{ flexFlow: 'column', alignItems: 'flex-start', minHeight: '10px' }}
        >
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.photographers')}
          </span>
          {this.state.loading ? <p>{this.state.loading}</p> : <></>}
          <ul>
            {this.state.photographers.map(({ name, count }) => (
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
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.curators')}
          </span>
          {this.state.loading ? <p>{this.state.loading}</p> : <></>}
          <ul>
            {this.state.curators.map((name) => (
              <li key={name} className="subtitle-photographers">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export { About as default, About };
