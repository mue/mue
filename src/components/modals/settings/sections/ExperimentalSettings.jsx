import React from 'react';
import Checkbox from '../Checkbox';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsFunctions from '../../../../modules/settingsFunctions';

export default class ExperimentalSettings extends React.PureComponent {
  render() {
    return (
        <div className='section'>
          <h4>{this.props.language.experimental.title}</h4>
          <ExpandMore style={{ 'transition': 'all 0.5s ease 0s' }} className='expandIcons' onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[5], document.getElementsByClassName('expandIcons')[5])} />
          <li className='extraSettings'>
            <Checkbox name='webp' text={this.props.language.experimental.webp} />
            <Checkbox name='animations' text={this.props.language.experimental.animations} />
            <Checkbox name='view' text={this.props.language.experimental.view} />
            <Checkbox name='favouriteEnabled' text={this.props.language.experimental.favourite} />
            <Checkbox name='refresh' text={this.props.language.experimental.refresh} />
          </li>
        </div>
    );
  }
}