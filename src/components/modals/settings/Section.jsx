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
    let display = 'none';
    if (this.state.display === 'none') display = 'block';
    let transform = 'rotate(0)';
    if (this.state.transform === 'rotate(0)') transform = 'rotate(-180deg)';

    this.setState({
      display: display,
      transform: transform
    });
  }

  render() {
    let extraHTML, expandMore, slider;
    if (this.props.children) {
        extraHTML = <li className='extraSettings'>{this.props.children}</li>
        expandMore = <ExpandMore
                        style={{ 'transition': 'all 0.5s ease 0s', 'transform': this.state.transform }}
                        className={`expandIcons`}
                        onClick={() => this.toggleSection()}
                      />
    }

    if (this.props.slider !== false) slider = <Slider name={this.props.name} />;

    return (
        <div className='section'>
            <h4 onClick={() => this.toggleSection()}>{this.props.title}</h4>
            {expandMore}
            {slider}
            <div style={{display: this.state.display}}>
              {extraHTML}
            </div>
        </div>
    );
  }
}