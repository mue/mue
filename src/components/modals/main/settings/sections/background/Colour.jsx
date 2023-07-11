import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import { ColorPicker } from '@muetab/react-color-gradient-picker';
import { toast } from 'react-toastify';
import SettingsItem from '../../SettingsItem';

import hexToRgb from 'modules/helpers/background/hexToRgb';
import rgbToHex from 'modules/helpers/background/rgbToHex';

//import '@muetab/react-color-gradient-picker/dist/index.css';
import '../../../scss/settings/react-color-picker-gradient-picker-custom-styles.scss';

export default class ColourSettings extends PureComponent {
  DefaultGradientSettings = {
    angle: '180',
    gradient: [{ colour: '#ffb032', stop: 0 }],
    type: 'linear',
  };
  GradientPickerInitialState = undefined;

  constructor() {
    super();
    this.state = {
      gradientSettings: this.DefaultGradientSettings,
    };
  }

  resetColour() {
    localStorage.setItem('customBackgroundColour', '');
    this.setState({
      gradientSettings: this.DefaultGradientSettings,
    });
    toast(variables.getMessage('toasts.reset'));
  }

  initialiseColourPickerState(gradientSettings) {
    this.GradientPickerInitialState = {
      points: gradientSettings.gradient.map((g) => {
        const rgb = hexToRgb(g.colour);
        return {
          left: +g.stop,
          red: rgb.red,
          green: rgb.green,
          blue: rgb.blue,
          alpha: 1,
        };
      }),
      degree: +gradientSettings.angle,
      type: gradientSettings.type,
    };
  }

  componentDidMount() {
    const hex = localStorage.getItem('customBackgroundColour');
    let gradientSettings = undefined;

    if (hex !== '') {
      try {
        gradientSettings = JSON.parse(hex);
      } catch (e) {
        // Disregard exception
      }
    }

    if (gradientSettings === undefined) {
      gradientSettings = this.DefaultGradientSettings;
    }

    this.setState({
      gradientSettings,
    });
  }

  componentDidUpdate() {
    localStorage.setItem('customBackgroundColour', this.currentGradientSettings());
  }

  onGradientChange = (event, index) => {
    const newValue = event.target.value;
    const name = event.target.name;
    this.setState((s) => {
      return {
        gradientSettings: {
          ...s.gradientSettings,
          gradient: s.gradientSettings.gradient.map((g, i) =>
            i === index ? { ...g, [name]: newValue } : g,
          ),
        },
      };
    });

    this.showReminder();
  };

  addColour = () => {
    this.setState((s) => {
      const [lastGradient, ...initGradients] = s.gradientSettings.gradient.reverse();
      return {
        gradientSettings: {
          ...s.gradientSettings,
          gradient: [
            ...initGradients,
            lastGradient,
            {
              colour: localStorage.getItem('theme') === 'dark' ? '#000000' : '#ffffff',
              stop: 100,
            },
          ].sort((a, b) => (a.stop > b.stop ? 1 : -1)),
        },
      };
    });

    variables.stats.postEvent('setting', 'Changed backgroundType from colour to gradient');
  };

  currentGradientSettings = () => {
    if (
      typeof this.state.gradientSettings === 'object' &&
      this.state.gradientSettings.gradient.every(
        (g) =>
          g.colour !==
          variables.getMessage('modals.main.settings.sections.background.source.disabled'),
      )
    ) {
      const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
      return JSON.stringify({
        ...this.state.gradientSettings,
        gradient: [
          ...this.state.gradientSettings.gradient.map((g) => {
            return { ...g, stop: clampNumber(+g.stop, 0, 100) };
          }),
        ].sort((a, b) => (a.stop > b.stop ? 1 : -1)),
      });
    }
    return variables.getMessage('modals.main.settings.sections.background.source.disabled');
  };

  onColourPickerChange = (attrs, name) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(attrs, name);
    }

    this.setState({
      gradientSettings: {
        angle: attrs.degree,
        gradient: attrs.points.map((p) => {
          return {
            colour: '#' + rgbToHex(p.red, p.green, p.blue),
            stop: p.left,
          };
        }),
        type: attrs.type,
      },
    });

    this.showReminder();
  };

  showReminder() {
    const reminderInfo = document.querySelector('.reminder-info');
    if (reminderInfo.style.display !== 'block') {
      reminderInfo.style.display = 'block';
      localStorage.setItem('showReminder', true);
    }
  }

  render() {
    let colourSettings = null;
    if (typeof this.state.gradientSettings === 'object') {
      const gradientHasMoreThanOneColour = this.state.gradientSettings.gradient.length > 1;

      let gradientInputs;
      if (gradientHasMoreThanOneColour) {
        if (this.GradientPickerInitialState === undefined) {
          this.initialiseColourPickerState(this.state.gradientSettings);
        }

        gradientInputs = (
          <ColorPicker
            onStartChange={(colour) => this.onColourPickerChange(colour, 'start')}
            onChange={(colour) => this.onColourPickerChange(colour, 'change')}
            onEndChange={(colour) => this.onColourPickerChange(colour, 'end')}
            gradient={this.GradientPickerInitialState}
            isGradient
          />
        );
      } else {
        gradientInputs = this.state.gradientSettings.gradient.map((g, i) => {
          return (
            <Fragment key={i}>
              <input
                id={'colour_' + i}
                type="color"
                name="colour"
                className="colour"
                onChange={(event) => this.onGradientChange(event, i)}
                value={g.colour}
              ></input>
              <label htmlFor={'colour_' + i} className="customBackgroundHex">
                {g.colour}
              </label>
            </Fragment>
          );
        });
      }

      colourSettings = (
        <>
          <div className="colourInput">{gradientInputs}</div>
          {!gradientHasMoreThanOneColour ? (
            <>
              <button type="button" className="add" onClick={this.addColour}>
                {variables.getMessage('modals.main.settings.sections.background.source.add_colour')}
              </button>
            </>
          ) : null}
        </>
      );
    }

    return (
      <>
        <SettingsItem
          title={variables.getMessage(
            'modals.main.settings.sections.background.source.custom_colour',
          )}
          final={true}
        >
          {colourSettings}
          <div className="colourReset">
            <span className="link" onClick={() => this.resetColour()}>
              {variables.getMessage('modals.main.settings.buttons.reset')}
            </span>
          </div>
        </SettingsItem>
      </>
    );
  }
}
