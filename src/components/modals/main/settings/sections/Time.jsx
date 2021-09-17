import variables from 'modules/variables';
import { PureComponent } from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Switch from '../Switch';
import Radio from '../Radio';
import Slider from '../Slider';

export default class TimeSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      timeType: localStorage.getItem('timeType') || 'digital',
      dateType: localStorage.getItem('dateType') || 'long'
    };
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    let timeSettings;

    const digitalOptions = [
      {
        name: getMessage('modals.main.settings.sections.time.digital.twentyfourhour'),
        value: 'twentyfourhour'
      },
      {
        name: getMessage('modals.main.settings.sections.time.digital.twelvehour'),
        value: 'twelvehour'
      }
    ];

    const digitalSettings = (
      <>
        <h3>{getMessage('modals.main.settings.sections.time.digital.title')}</h3>
        <Radio title={getMessage('modals.main.settings.sections.time.format')} name='timeformat' options={digitalOptions} smallTitle={true} category='clock' />
        <br/>
        <Checkbox name='seconds' text={getMessage('modals.main.settings.sections.time.digital.seconds')} category='clock' />
        <Checkbox name='zero' text={getMessage('modals.main.settings.sections.time.digital.zero')} category='clock' />
      </>
    );

    const analogSettings = (
      <>
        <h3>{getMessage('modals.main.settings.sections.time.analogue.title')}</h3>
        <Checkbox name='secondHand' text={getMessage('modals.main.settings.sections.time.analogue.second_hand')} category='clock' />
        <Checkbox name='minuteHand' text={getMessage('modals.main.settings.sections.time.analogue.minute_hand')} category='clock' />
        <Checkbox name='hourHand' text={getMessage('modals.main.settings.sections.time.analogue.hour_hand')} category='clock' />
        <Checkbox name='hourMarks' text={getMessage('modals.main.settings.sections.time.analogue.hour_marks')} category='clock' />
        <Checkbox name='minuteMarks' text={getMessage('modals.main.settings.sections.time.analogue.minute_marks')} category='clock' />
      </>
    );

    switch (this.state.timeType) {
      case 'digital': timeSettings = digitalSettings; break;
      case 'analogue': timeSettings = analogSettings; break;
      default: timeSettings = null; break;
    }

    let dateSettings;
    
    const longSettings = (
      <>
        <Checkbox name='dayofweek' text={getMessage('modals.main.settings.sections.time.date.day_of_week')} category='date' />
        <Checkbox name='datenth' text={getMessage('modals.main.settings.sections.time.date.datenth')} category='date' />
      </>
    );

    const shortSettings = (
      <>
        <br/>
        <Dropdown label={getMessage('modals.main.settings.sections.time.date.short_format')} name='dateFormat' category='date'>
          <option value='DMY'>DMY</option>
          <option value='MDY'>MDY</option>
          <option value='YMD'>YMD</option>
        </Dropdown>
        <br/><br/>
        <Dropdown label={getMessage('modals.main.settings.sections.time.date.short_separator.title')} name='shortFormat' category='date'>
          <option value='dash'>{getMessage('modals.main.settings.sections.time.date.short_separator.dash')}</option>
          <option value='dots'>{getMessage('modals.main.settings.sections.time.date.short_separator.dots')}</option>
          <option value='gaps'>{getMessage('modals.main.settings.sections.time.date.short_separator.gaps')}</option>
          <option value='slashes'>{getMessage('modals.main.settings.sections.time.date.short_separator.slashes')}</option>
       </Dropdown>
      </>
    );

    switch (this.state.dateType) {
      case 'short': dateSettings = shortSettings; break;
      case 'long': dateSettings = longSettings; break;
      default: break;
    }

    return (
      <>
        <h2>{getMessage('modals.main.settings.sections.time.title')}</h2>
        <Switch name='time' text={getMessage('modals.main.settings.enabled')} category='clock' element='.clock-container' />
        <Dropdown label={getMessage('modals.main.settings.sections.time.type')} name='timeType' onChange={(value) => this.setState({ timeType: value })} category='clock'>
          <option value='digital'>{getMessage('modals.main.settings.sections.time.digital.title')}</option>
          <option value='analogue'>{getMessage('modals.main.settings.sections.time.analogue.title')}</option>
          <option value='percentageComplete'>{getMessage('modals.main.settings.sections.time.percentage_complete')}</option>
        </Dropdown>
        {timeSettings}
        {this.state.timeType !== 'analogue' ? 
          <Slider title={getMessage('modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomClock' min='10' max='400' default='100' display='%' category='clock'/>
        : null}

        <h3>{getMessage('modals.main.settings.sections.time.date.title')}</h3>
        <Switch name='date' text={getMessage('modals.main.settings.enabled')} category='date' element='.date'/>
        <Dropdown label={getMessage('modals.main.settings.sections.time.type')} name='dateType' onChange={(value) => this.setState({ dateType: value })} category='date'>
          <option value='long'>{getMessage('modals.main.settings.sections.time.date.type.long')}</option>
          <option value='short'>{getMessage('modals.main.settings.sections.time.date.type.short')}</option>
        </Dropdown>
        <br/>
        <Checkbox name='datezero' text={getMessage('modals.main.settings.sections.time.digital.zero')} category='date'/>
        <Checkbox name='weeknumber' text={getMessage('modals.main.settings.sections.time.date.week_number')} category='date'/>
        {dateSettings}
        <Slider title={getMessage('modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomDate' min='10' max='400' default='100' display='%' category='date'/>
      </>
    );
  }
}
