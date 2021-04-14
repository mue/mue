import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import EmailIcon from '@material-ui/icons/Email';
import TwitterIcon from '@material-ui/icons/Twitter';
import ForumIcon from '@material-ui/icons/Forum';

const other_contributors = require('../../../../../modules/other_contributors.json');

export default class About extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      contributors: [],
      sponsors: [],
      other_contributors: [],
      photographers: [],
      update: window.language.modals.main.settings.sections.about.version.checking_update,
      loading: window.language.modals.main.loading
    };
    this.language = window.language.modals.main.settings.sections.about;
  }

  async getGitHubData() {
    let contributors, sponsors, photographers, versionData;
    try {
      contributors = await (await fetch(window.constants.GITHUB_URL + '/repos/mue/mue/contributors')).json();
      sponsors = (await (await fetch(window.constants.SPONSORS_URL + '/list')).json()).sponsors;
      photographers = await (await fetch(window.constants.API_URL + '/images/photographers')).json();
  
      versionData = await (await fetch(window.constants.GITHUB_URL + '/repos/mue/mue/releases')).json();
    } catch (e) {
      return this.setState({
        update: 'Failed to get update information',
        loading: 'An error occurred'
      });
    }

    const newVersion = versionData[0].tag_name;

    let updateMsg = this.language.version.no_update;
    if (Number(window.constants.VERSION) < newVersion) {
      updateMsg = `${this.language.version.update_available}: ${newVersion}`;
    }

    this.setState({
      contributors: contributors.filter((contributor) => !contributor.login.includes('bot')),
      sponsors: sponsors,
      update: updateMsg,
      other_contributors: other_contributors,
      photographers: photographers.sort().join(', '), 
      loading: null
    });
  }

  componentDidMount() {
    if (localStorage.getItem('offlineMode') === 'true') {
      this.setState({
        update: this.language.version.offline_mode
      });
      return;
    }

    this.getGitHubData();
  }

  render() {
    return (
      <>
        <h2>{this.language.title}</h2>
        <img draggable='false' style={{'height': '100px', 'width': 'auto'}} src='./././icons/logo_horizontal.png' alt='Mue logo'></img>
        <p>{this.language.copyright} 2018-{new Date().getFullYear()} Mue Tab (BSD-3 License)</p>
        <p>{this.language.version.title} {window.constants.VERSION} ({this.state.update})</p>

        <h3>{window.language.modals.welcome.support}</h3>
        <a href='mailto:hello@muetab.com' className='welcomeLink' target='_blank' rel='noopener noreferrer'><EmailIcon/></a>
        <a href='https://twitter.com/getmue' className='welcomeLink' target='_blank' rel='noopener noreferrer'><TwitterIcon/></a>
        <a href='https://discord.gg/zv8C9F8' className='welcomeLink' target='_blank' rel='noopener noreferrer'><ForumIcon/></a>

        <h3>{this.language.resources_used.title}</h3>
        <p>Pexels ({this.language.resources_used.bg_images})</p>
        <p>Google ({this.language.resources_used.pin_icon})</p>
        <p>Undraw ({this.language.resources_used.welcome_img})</p>

        <h3>{this.language.contributors}</h3>
        {this.state.loading}
        {this.state.contributors.map((item) => (
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=128'} alt={item.login}/></a>
          </Tooltip>
        ))}
        { // for those who contributed without opening a pull request
        this.state.other_contributors.map((item) => (
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=128'} alt={item.login}/></a>
          </Tooltip>
        ))}

        <h3>{this.language.supporters}</h3>
        {this.state.loading}
        {this.state.sponsors.map((item) => (
          <Tooltip title={item.handle} placement='top' key={item.handle}>
            <a href={item.profile} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar + '&size=128'} alt={item.handle}></img></a>
          </Tooltip>
        ))}

        <h3>{this.language.photographers}</h3>
        {this.state.loading}
        <p>{this.state.photographers}</p>
      </>
    );
  }
}
