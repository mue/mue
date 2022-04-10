import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdEmail, MdContactPage } from 'react-icons/md';
import { FaDiscord, FaTwitter, FaPatreon, FaGithub } from 'react-icons/fa';
import { SiGithubsponsors, SiLiberapay, SiKofi, SiPatreon } from 'react-icons/si';
import { BiDonateHeart } from 'react-icons/bi';

import Tooltip from 'components/helpers/tooltip/Tooltip';

import SettingsItem from '../SettingsItem';

const other_contributors = require('modules/other_contributors.json');

export default class About extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      contributors: [],
      sponsors: [],
      other_contributors: [],
      photographers: this.getMessage('modals.main.loading'),
      update: this.getMessage('modals.main.settings.sections.about.version.checking_update'),
      loading: this.getMessage('modals.main.loading'),
      image:
        localStorage.getItem('theme') === 'dark'
          ? './././icons/mue_dark.svg'
          : './././icons/mue_light.svg',
    };
    this.controller = new AbortController();
  }

  async getGitHubData() {
    let contributors, sponsors, photographers, versionData;

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
    } catch (e) {
      if (this.controller.signal.aborted === true) {
        return;
      }

      return this.setState({
        update: this.getMessage('modals.main.settings.sections.about.version.error.title'),
        loading: this.getMessage('modals.main.settings.sections.about.version.error.description'),
      });
    }

    if (sponsors.length === 0) {
      sponsors = [{ handle: 'empty' }];
    }

    if (this.controller.signal.aborted === true) {
      return;
    }

    const newVersion = versionData[0].tag_name;

    let update = this.getMessage('modals.main.settings.sections.about.version.no_update');
    if (
      Number(variables.constants.VERSION.replaceAll('.', '')) <
      Number(newVersion.replaceAll('.', ''))
    ) {
      update = `${this.getMessage(
        'modals.main.settings.sections.about.version.update_available',
      )}: ${newVersion}`;
    }

    this.setState({
      // exclude bots
      contributors: contributors.filter((contributor) => !contributor.login.includes('bot')),
      sponsors,
      update,
      other_contributors,
      photographers: photographers.sort().join(', '),
      loading: null,
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      this.setState({
        update: this.getMessage('modals.main.settings.sections.about.version.checking_update'),
        loading: this.getMessage('modals.main.marketplace.offline.description'),
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
      <>
        <span className="mainTitle">
          {this.getMessage('modals.main.settings.sections.about.title')}
        </span>
        <div className='settingsRow' style={{ justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexFlow: 'column', gap: '5px' }}>
            <img draggable="false" className="aboutLogo" src={this.state.image} alt="Logo" />
            <span className="title">
              {this.getMessage('modals.main.settings.sections.about.version.title')}{' '}
              {variables.constants.VERSION}
            </span>
            <span className="subtitle">({this.state.update})</span>
            <span className="subtitle">
              {this.getMessage('modals.main.settings.sections.about.copyright')}{' '}
              {variables.constants.COPYRIGHT_YEAR}-{new Date().getFullYear()}{' '}
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
                {variables.constants.COPYRIGHT_NAME}
              </a>{' '}
              ({variables.constants.COPYRIGHT_LICENSE})
            </span>
            <span className="subtitle">
              <a
                href={variables.constants.PRIVACY_URL}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.getMessage('modals.welcome.sections.privacy.links.privacy_policy')}
              </a>
            </span>
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {this.getMessage('modals.main.settings.sections.about.contact_us')}
          </span>
          <div className="aboutContact">
              <a class='donateButton' href='https://muetab.com/contact'>
                <MdContactPage />
                Form
              </a>
            <Tooltip title={'Email'}>
              <a
                href={'mailto:' + variables.constants.EMAIL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdEmail />
              </a>
            </Tooltip>
            <Tooltip title={'Twitter'}>
              <a
                href={'https://twitter.com/' + variables.constants.TWITTER_HANDLE}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
            </Tooltip>
            <Tooltip title={'Discord'}>
              <a
                href={'https://discord.gg/' + variables.constants.DISCORD_SERVER}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord />
              </a>
            </Tooltip>
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {this.getMessage('modals.main.settings.sections.about.support_mue')}
          </span>
          <p>As Mue is entirely free, we rely on donations to cover pay the server bills and fund development</p>
          <div className="aboutContact">
            <a class='donateButton' href={variables.constants.DONATE_LINK}>
              <BiDonateHeart />
              Donate
              </a>
              <Tooltip title={'Github Sponsors'}>
              <a
                href={'https://discord.gg/' + variables.constants.DISCORD_SERVER}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiGithubsponsors />
              </a>
            </Tooltip>
            <Tooltip title={'Liberapay'}>
              <a
                href={'https://discord.gg/' + variables.constants.DISCORD_SERVER}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiLiberapay />
              </a>
            </Tooltip>
            <Tooltip title={'Ko-Fi'}>
              <a
                href={'https://discord.gg/' + variables.constants.DISCORD_SERVER}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiKofi />
              </a>
            </Tooltip>
            <Tooltip title={'Patreon'}>
              <a
                href={'https://discord.gg/' + variables.constants.DISCORD_SERVER}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiPatreon />
              </a>
            </Tooltip>
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {this.getMessage('modals.main.settings.sections.about.resources_used.title')}
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
            ({this.getMessage('modals.main.settings.sections.about.resources_used.bg_images')})
          </span>
          <span className="subtitle">
            <a href="https://undraw.co" className="link" target="_blank" rel="noopener noreferrer">
              Undraw
            </a>{' '}
            ({this.getMessage('modals.main.settings.sections.about.resources_used.welcome_img')})
          </span>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {this.getMessage('modals.main.settings.sections.about.contributors')}
          </span>
          <p>{this.state.loading}</p>
          <div className="contributorImages">
            {this.state.contributors.map(({ login, id }) => (
              <Tooltip title={login} key={login}>
                <a href={'https://github.com/' + login} target="_blank" rel="noopener noreferrer">
                  <img
                    draggable="false"
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
                    <img draggable="false" src={avatar_url + '&s=128'} alt={login}></img>
                  </a>
                </Tooltip>
              ))
            }
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {this.getMessage('modals.main.settings.sections.about.supporters')}
          </span>
          <p>{this.state.loading}</p>
          <div className="contributorImages">
            {this.state.sponsors.map(({ handle, avatar }) => {
              if (handle === 'empty') {
                return (
                  <p>{this.getMessage('modals.main.settings.sections.about.no_supporters')}</p>
                );
              }

              return (
                <Tooltip title={handle} key={handle}>
                  <a
                    href={'https://github.com/' + handle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img draggable="false" src={avatar.split('?')[0] + '?s=128'} alt={handle}></img>
                  </a>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {this.getMessage('modals.main.settings.sections.about.photographers')}
          </span>
          <span className="subtitle">{this.state.photographers}</span>
        </div>
      </>
    );
  }
}
