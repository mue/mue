import variables from 'config/variables';
import { PureComponent } from 'react';
/*import {
  Radio as RadioUI,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';*/
import { Radio as PureRadio, RadioGroup } from '@headlessui/react'
import { MdCheckCircle } from "react-icons/md";



import EventBus from 'utils/eventbus';
import { translations } from 'lib/translations';

class Radio extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name),
    };
  }

  handleChange = async (value) => {
    if (value === 'loading') {
      return;
    }
  
    if (this.props.name === 'language') {
      // old tab name
      if (localStorage.getItem('tabName') === variables.getMessage('tabname')) {
        localStorage.setItem('tabName', translations[value.replace('-', '_')].tabname);
      }
    }
  
    localStorage.setItem(this.props.name, value);
  
    this.setState({
      value,
    });
  
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  
    variables.stats.postEvent('setting', `${this.props.name} from ${this.state.value} to ${value}`);
  
    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }
  
    EventBus.emit('refresh', this.props.category);
  };

  render() {
    return (
      {
        /*<FormControl component="fieldset">
        <FormLabel
          className={this.props.smallTitle ? 'radio-title-small' : 'radio-title'}
          component="legend"
        >
          {this.props.title}
        </FormLabel>
        <RadioGroup
          aria-label={this.props.name}
          name={this.props.name}
          onChange={this.handleChange}
          value={this.state.value}
        >
          {this.props.options.map((option) => (
            <FormControlLabel
              value={option.value}
              control={<RadioUI />}
              label={option.name}
              key={option.name}
            />
          ))}
        </RadioGroup>
        </FormControl>*/
      },
      (
        <div className="w-full">
            <RadioGroup
              aria-label={this.props.name}
              name={this.props.name}
              onChange={this.handleChange}
              value={this.state.value}
              className="space-y-2"
            >
              {this.props.options.map((option) => (
                <PureRadio
                  key={option.name}
                  label={option.name}
                  value={option.value}
                  className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="text-sm/6">
                      <p className="font-semibold text-white">{option.name}</p>
                      <div className="flex gap-2 text-white/50">
                        <div>10%</div>
                        <div aria-hidden="true">&middot;</div>
                        <div>sus</div>
                      </div>
                    </div>
                    <MdCheckCircle className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
                  </div>
                </PureRadio>
              ))}
            </RadioGroup>
          </div>
      )
    );
  }
}

export { Radio as default, Radio };
