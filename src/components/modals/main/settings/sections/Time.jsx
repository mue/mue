import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';

export default class TimeSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      timeType: localStorage.getItem('timeType') || 'digital'
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

    return (
      <>
        <Header title={getMessage('modals.main.settings.sections.time.title')} category='clock' element='.clock-container' zoomSetting='zoomClock' category='clock'/>
        <Dropdown label={getMessage('modals.main.settings.sections.time.type')} name='timeType' onChange={(value) => this.setState({ timeType: value })} category='clock'>
          <option value='digital'>{getMessage('modals.main.settings.sections.time.digital.title')}</option>
          <option value='analogue'>{getMessage('modals.main.settings.sections.time.analogue.title')}</option>
          <option value='percentageComplete'>{getMessage('modals.main.settings.sections.time.percentage_complete')}</option>
        </Dropdown>
        {timeSettings}
      </>
    );
  }
}
