import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';

export default class About extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
        contributors: []
    }
  }

  async getContributors() {
    const data = await (await fetch('https://api.github.com/repos/mue/mue/contributors')).json();

    this.setState({ 
        contributors: data // TODO: REMOVE BOTS AND MAKE IT ACTUALLY WORK
    });
  }

  componentDidMount() {
    this.getContributors();
  }

  render() {
    return (
      <div>
          <h2>About</h2>
          <img style={{'height': '100px', 'width': 'auto'}} src='https://raw.githubusercontent.com/mue/branding/master/logo/logo_horizontal.png' alt='Mue logo'></img>
          <p>Copyright 2018-2021 Mue Tab (BSD-3 License)</p>
          <p>Version 5.0.0</p>
          <h3>Contributors</h3>
          {this.state.contributors.map((item) =>
            <Tooltip title={item.login} placement='top' key={item.login}>
                <a href={'https://github.com/' + item.login}><img className='abouticon' src={item.avatar_url} alt={item.login}></img></a>
            </Tooltip>
          )}
      </div>
    );
  }
}