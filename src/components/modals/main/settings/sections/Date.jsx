import variables from 'modules/variables';
import { PureComponent } from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Switch from '../Switch';
import Slider from '../Slider';

export default class DateSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      dateType: localStorage.getItem('dateType') || 'long'
    };
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

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
        <h2>{getMessage('modals.main.settings.sections.time.date.title')}</h2>
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
