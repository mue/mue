import React from 'react';
import Slider from '../Slider';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsFunctions from '../../../../modules/settingsFunctions';

export default class ExperimentalSettings extends React.PureComponent {
  render() {
    return (
        <div className='section'>
        <h4>{this.props.language.experimental.title}</h4>
        <ExpandMore style={{ 'transition': 'all 0.5s ease 0s' }} className='expandIcons' onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName('extraSettings')[5], document.getElementsByClassName('expandIcons')[5])} />
        <li className='extraSettings'>
          <div className='section'>
            <h4>{this.props.language.experimental.webp}</h4>
            <Slider name='webp' />
          </div>
          <div className='section'>
             <h4>{this.props.language.experimental.animations}</h4>
             <Slider name='animations' />
          </div>
          <div className='section'>
             <h4>View</h4>
             <Slider name='view' />
          </div>
          <div className='section'>
             <h4>Favourite</h4>
             <Slider name='favouriteEnabled' />
          </div>
          <div className='section'>
             <h4>Refresh</h4>
             <Slider name='refresh' />
          </div>
        </li>
      </div>
    );
  }
}