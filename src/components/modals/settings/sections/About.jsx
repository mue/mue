import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';

import * as Constants from '../../../../modules/constants';

const other_contributors = require('../../../../modules/other_contributors.json');

export default class About extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      contributors: [],
      update: ''
    }
  }

  async getGitHubData() {
    const contributors = await (await fetch('https://api.github.com/repos/mue/mue/contributors')).json();
    const versionData = await (await fetch('https://api.github.com/repos/mue/mue/releases')).json();

    let updateMsg = this.props.language.version.no_update;
    let version = versionData[0].tag_name;
    if (version !== '5.0' && version !== '4.1') {
      updateMsg = `${this.props.language.version.update_available}: ${version}`;
    }

    // TODO: REMOVE BOTS AND MAKE IT ACTUALLY WORK
    this.setState({
      contributors: contributors,
      update: updateMsg
    });
  }

  componentDidMount() {
    this.getGitHubData();
  }

  render() {
    return (
      <div>
        <h2>{this.props.language.title}</h2>
        <img draggable='false' style={{'height': '100px', 'width': 'auto'}} src='https://raw.githubusercontent.com/mue/branding/master/logo/logo_horizontal.png' alt='Mue logo'></img>
        <p>{this.props.language.copyright} 2018-{new Date().getFullYear()} Mue Tab (BSD-3 License)</p>
        <p>{this.props.language.version.title} {Constants.VERSION} ({this.state.update})</p>
        <h3>{this.props.language.resources_used.title}</h3>
        <p>Pexels ({this.props.language.resources_used.bg_images})</p>
        <p>Google ({this.props.language.resources_used.pin_icon})</p>
        <h3>{this.props.language.contributors}</h3>
        {this.state.contributors.map((item) =>
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=256'} alt={item.login}></img></a>
          </Tooltip>
        )}
        {// for those who contributed without opening a pull request
        other_contributors.map((item) =>
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=256'} alt={item.login}></img></a>
          </Tooltip>
        )}
        <h3>{this.props.language.supporters}</h3>
        <p>to be implemented</p>
      </div>
    );
  }
}
