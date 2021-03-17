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

    let updateMsg = 'No update available';
    let version = versionData[0].tag_name;
    if (version !== '5.0' && version !== '4.1') {
      updateMsg = 'Update available: ' + version;
    }

    this.setState({
      contributors: contributors, // TODO: REMOVE BOTS AND MAKE IT ACTUALLY WORK,
      update: updateMsg
    });
  }

  componentDidMount() {
    this.getGitHubData();
  }

  render() {
    return (
      <div>
        <h2>About</h2>
        <img draggable='false' style={{'height': '100px', 'width': 'auto'}} src='https://raw.githubusercontent.com/mue/branding/master/logo/logo_horizontal.png' alt='Mue logo'></img>
        <p>Copyright 2018-{new Date().getFullYear()} Mue Tab (BSD-3 License)</p>
        <p>Version {Constants.VERSION} ({this.state.update})</p>
        <h3>Resources Used</h3>
        <p>Pexels (Background Images)</p>
        <p>Google (Pin Icon)</p>
        <h3>Contributors</h3>
        {this.state.contributors.map((item) =>
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=256'} alt={item.login}></img></a>
          </Tooltip>
        )}
        {other_contributors.map((item) => // for those who contributed without opening a pull request
          <Tooltip title={item.login} placement='top' key={item.login}>
            <a href={'https://github.com/' + item.login} target='_blank' rel='noopener noreferrer'><img draggable='false' className='abouticon' src={item.avatar_url + '&size=256'} alt={item.login}></img></a>
          </Tooltip>
        )}
        <h3>Supporters</h3>
        <p>to be implemented</p>
      </div>
    );
  }
}
