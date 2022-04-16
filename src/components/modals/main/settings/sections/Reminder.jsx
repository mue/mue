import variables from 'modules/variables';
import { PureComponent } from 'react';
import Header from '../Header';
import { MdRemoveCircleOutline } from 'react-icons/md';
import SettingsItem from '../SettingsItem';
export default class ReminderSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      colour: localStorage.getItem('reminderColour') || '#ffa500',
      reminder: JSON.parse(localStorage.getItem('reminder')) || [
        {
          value: '',
          done: false,
        },
      ],
    };
  }

  updateColour(event) {
    const colour = event.target.value;
    this.setState({ colour });
    localStorage.setItem('reminderColour', colour);
  }

  addReminder() {
    let reminderTitle = this.state.todo;
    reminderTitle.push({
      value: '',
      done: false,
    });
    this.updateReminderState(reminderTitle);
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
        <SettingsItem final={true} title="Add reminder" subtitle="Add reminder">
          <button onClick={() => this.addReminder()}>Add reminder</button>
        </SettingsItem>
        <div className="reminderSettingsHolder">
          <div className="reminderSetting">
            <div>
              <div className="colorPicker">
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
              </div>
              <span className="link">
                <MdRemoveCircleOutline /> Remove
              </span>
            </div>
            <div>
              <span className="title">
                <input type="text" id="lname" placeholder="Name" />
              </span>
              <input type="date" required />
            </div>
          </div>
        </div>
      </>
    );
  }
}
