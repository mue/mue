import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

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
        <Checkbox name='dayofweek' text={getMessage('modals.main.settings.sections.date.day_of_week')} category='date' />
        <Checkbox name='datenth' text={getMessage('modals.main.settings.sections.date.datenth')} category='date' />
      </>
    );

    const shortSettings = (
      <>
        
        <Dropdown label={getMessage('modals.main.settings.sections.date.short_format')} name='dateFormat' category='date'>
          <option value='DMY'>DMY</option>
          <option value='MDY'>MDY</option>
          <option value='YMD'>YMD</option>
        </Dropdown>
        
        <Dropdown label={getMessage('modals.main.settings.sections.date.short_separator.title')} name='shortFormat' category='date'>
          <option value='dash'>{getMessage('modals.main.settings.sections.date.short_separator.dash')}</option>
          <option value='dots'>{getMessage('modals.main.settings.sections.date.short_separator.dots')}</option>
          <option value='gaps'>{getMessage('modals.main.settings.sections.date.short_separator.gaps')}</option>
          <option value='slashes'>{getMessage('modals.main.settings.sections.date.short_separator.slashes')}</option>
       </Dropdown>
      </>
    );

    if (this.state.dateType === 'long') {
      dateSettings = longSettings;
    } else {
      dateSettings = shortSettings;
    }

    return (
      <>
        <Header title={getMessage('modals.main.settings.sections.date.title')} setting='date' category='date' element='.date' zoomSetting='zoomDate'/>
        <Checkbox name='weeknumber' text={getMessage('modals.main.settings.sections.date.week_number')} category='date'/>
        <Dropdown label={getMessage('modals.main.settings.sections.time.type')} name='dateType' onChange={(value) => this.setState({ dateType: value })} category='date'>
          <option value='long'>{getMessage('modals.main.settings.sections.date.type.long')}</option>
          <option value='short'>{getMessage('modals.main.settings.sections.date.type.short')}</option>
        </Dropdown>
        
        <Checkbox name='datezero' text={getMessage('modals.main.settings.sections.time.digital.zero')} category='date'/>
        {dateSettings}
      </>
    );
  }
}
