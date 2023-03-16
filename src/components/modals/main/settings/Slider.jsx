import variables from 'modules/variables';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Slider } from '@mui/material';
import { MdRefresh } from 'react-icons/md';

import EventBus from 'modules/helpers/eventbus';

class SliderComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || this.props.default,
    };
  }

  handleChange = (e, text) => {
    let { value } = e.target;
    value = Number(value);

    if (text) {
      if (value === '') {
        return this.setState({
          value: 0,
        });
      }

      if (value > this.props.max) {
        value = this.props.max;
      }

      if (value < this.props.min) {
        value = this.props.min;
      }
    }

    localStorage.setItem(this.props.name, value);
    this.setState({
      value,
    });

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', this.props.category);
  };

  resetItem = () => {
    this.handleChange({
      target: {
        value: this.props.default || '',
      },
    });
    toast(variables.getMessage('toasts.reset'));
  };

  render() {
    return (
      <>
        <span className={'sliderTitle'}>
          {this.props.title}
          <span>{Number(this.state.value)}</span>
          <span className="link" onClick={this.resetItem}>
            <MdRefresh />
            {variables.getMessage('modals.main.settings.buttons.reset')}
          </span>
        </span>
        <Slider
          value={Number(this.state.value)}
          onChange={this.handleChange}
          valueLabelDisplay="auto"
          default={Number(this.props.default)}
          min={Number(this.props.min)}
          max={Number(this.props.max)}
          step={Number(this.props.step) || 1}
          getAriaValueText={(value) => `${value}`}
          marks={this.props.marks || []}
        />
      </>
    );
  }
}

SliderComponent.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  default: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  marks: PropTypes.array,
  element: PropTypes.string,
  category: PropTypes.string,
};

export default SliderComponent;
