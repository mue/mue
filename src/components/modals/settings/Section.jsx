import React from 'react';
import SettingsFunctions from '../../../modules/settingsFunctions';
import Slider from './Slider';
import ExpandMore from '@material-ui/icons/ExpandMore';

export default class Section extends React.PureComponent {
  render() {
    let extraHTML, expandMore;
    if (this.props.children) {
        extraHTML = <li className={'extraSettings ' + this.props.title}>{this.props.children}</li>
        expandMore = <ExpandMore
                        style={{ 'transition': 'all 0.5s ease 0s' }}
                        className={`expandIcons expand${this.props.title}`}
                        onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName(this.props.title)[0], document.getElementsByClassName('expand' + this.props.title)[0])}
                    />
    }
    return (
        <div className='section'>
            <h4 onClick={() => SettingsFunctions.toggleExtra(document.getElementsByClassName(this.props.title)[0], document.getElementsByClassName('expand' + this.props.title)[0])}>{this.props.title}</h4>
            {expandMore}
            <Slider name={this.props.name} />
            {extraHTML}
        </div>
    );
  }
}