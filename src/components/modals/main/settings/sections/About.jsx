import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';

const other_contributors = require('../../../../../modules/other_contributors.json');

export default class About extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      contributors: [],
      sponsors: [],
      other_contributors: [],
      update: window.language.modals.main.settings.sections.about.version.checking_update
    }
    this.language = window.language.modals.main.settings.sections.about;
  }

  async getGitHubData() {
    const contributors = await (await fetch('https://api.github.com/repos/mue/mue/contributors')).json();
    const { sponsors } = await (await fetch(window.constants.SPONSORS_URL + '/list')).json();

    const versionData = await (await fetch('https://api.github.com/repos/mue/mue/releases')).json();
    const newVersion = versionData[0].tag_name;

    let updateMsg = this.language.version.no_update;
    if (Number(window.constants.VERSION) < newVersion) {
      updateMsg = `${this.language.version.update_available}: ${newVersion}`;
    }

    this.setState({
      contributors: contributors.filter((contributor) => !contributor.login.includes('bot')),
      sponsors: sponsors,
      update: updateMsg,
      other_contributors: other_contributors
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
      <div>
        <h2>{this.language.title}</h2>
        <img draggable='false' style={{'height': '100px', 'width': 'auto'}} src='https://raw.githubusercontent.com/mue/branding/master/logo/logo_horizontal.png' alt='Mue logo'></img>
        <p>{this.language.copyright} 2018-{new Date().getFullYear()} Mue Tab (BSD-3 License)</p>
        <p>{this.language.version.title} {window.constants.VERSION} ({this.state.update})</p>
        <h3>{this.language.resources_used.title}</h3>
        <p>Pexels ({this.language.resources_used.bg_images})</p>
        <p>Google ({this.language.resources_used.pin_icon})</p>
        <p>Undraw ({this.language.resources_used.welcome_img})</p>
        <h3>{this.language.contributors}</h3>
        {this.state.contributors.map((item) =>
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=256'} alt={item.login}></img></a>
          </Tooltip>
        )}
        { // for those who contributed without opening a pull request
        this.state.other_contributors.map((item) =>
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=256'} alt={item.login}></img></a>
          </Tooltip>
        )}
        <h3>{this.language.supporters}</h3>
        {this.state.sponsors.map((item) =>
          <Tooltip title={item.handle} placement='top' key={item.handle}>
            <a href={item.profile} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar + '&size=256'} alt={item.handle}></img></a>
          </Tooltip>
        )}
      </div>
    );
  }
}
