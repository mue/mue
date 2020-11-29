import React from 'react';
import Slider from './Slider';
import ExpandMore from '@material-ui/icons/ExpandMore';

export default class Section extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      display: 'none',
      transform: 'rotate(0)'
    };
  }

  toggleSection() {
    const display = (this.state.display === 'none') ? 'block' : 'none';

    this.setState({
      display: display,
      transform: (this.state.transform === 'rotate(0)') ? 'rotate(-180deg)' : 'rotate(0)'
    });

    if (this.props.onToggle) this.props.onToggle(display);
  }

  render() {
    let extraHTML, expandMore, slider, noDropdown;

    if (this.props.children) {
        extraHTML = (
          <div style={{ display: this.state.display }}>
            <li className='extraSettings'>{this.props.children}</li>
          </div>
        );
        expandMore = (
          <ExpandMore
            style={{ 'transition': 'all 0.5s ease 0s', 'transform': this.state.transform }}
            className={`expandIcons`}
            onClick={() => this.toggleSection()} />
        );
    }
    if (this.props.slider !== false) slider = <Slider name={this.props.name} />;
    if (this.props.dropdown === false) noDropdown = 'nodropdown';

    return (
        <div className='section'>
            <h4 className={noDropdown} onClick={() => this.toggleSection()}>{this.props.title}</h4>
            {expandMore}
            {slider}
            {extraHTML}
        </div>
    );
  }
}