import variables from 'modules/variables';
import { PureComponent } from 'react';
import Header from '../Header';

export default class ReminderSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      colour: localStorage.getItem('reminderColour') || '#ffa500',
    };
  }

  updateColour(event) {
    const colour = event.target.value;
    this.setState({ colour });
    localStorage.setItem('reminderColour', colour);
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);
    return (
      <>
        <Header
          title="Reminder"
          setting="reminder"
          category="reminder"
          element=".reminder"
          zoomSetting="zoomReminder"
          switch={true}
        />
        <input
          type="color"
          name="colour"
          className="colour"
          onChange={(event) => this.updateColour(event)}
          value={this.state.colour}
        ></input>
        <label htmlFor={'colour'} className="customBackgroundHex">
          {this.state.colour}
        </label>
      </>
    );
  }
}
