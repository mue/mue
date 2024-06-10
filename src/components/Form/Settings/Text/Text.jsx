import variables from 'config/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import { Description, Field, Label, Textarea, Input } from '@headlessui/react';
import { MdRefresh } from 'react-icons/md';
import clsx from 'clsx';

import EventBus from 'utils/eventbus';

class Text extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || '',
    };
  }

  handleChange = (e) => {
    let { value } = e.target;

    // Alex wanted font to work with montserrat and Montserrat, so I made it work
    if (this.props.upperCaseFirst === true) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
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
      <Field className="w-full">
        <div className="w-full flex flex-row justify-between items-center">
        <Label>{this.props.title}</Label>
        <span className="link" onClick={this.resetItem}>
          <MdRefresh />
          {variables.getMessage('modals.main.settings.buttons.reset')}
        </span>
        </div>
        {this.props.textarea === true ? (
          <>
            <Textarea
              value={this.state.value}
              onChange={this.handleChange}
              className={clsx(
                'bg-white/5 box-border mt-3 block w-full resize-none rounded-lg py-1.5 px-3 text-sm/6 text-white border border-[#484848]',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              )}
              rows={4}
            />
          </>
        ) : (
          <>
            <Input
              value={this.state.value}
              onChange={this.handleChange}
              placeholder={this.props.placeholder || ''}
              className={clsx(
                'box-border mt-3 block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white border border-[#484848]',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              )}
            />
          </>
        )}
      </Field>
    );
  }
}

export { Text as default, Text };

/*<TextField
  label={this.props.title}
  value={this.state.value}
  onChange={this.handleChange}
  varient="outlined"
  className={this.props.customcss ? 'customcss' : ''}
  multiline
  spellCheck={false}
  minRows={4}
  maxRows={10}
  InputLabelProps={{ shrink: true }}
/>

<TextField
            label={this.props.title}
            value={this.state.value}
            onChange={this.handleChange}
            varient="outlined"
            InputLabelProps={{ shrink: true }}
            placeholder={this.props.placeholder || ''}
          />
*/
