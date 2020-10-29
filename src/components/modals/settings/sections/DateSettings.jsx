import React from 'react';
import SettingsFunctions from '../../../../modules/helpers/settings';
import Section from '../Section';
import Dropdown from '../Dropdown';

export default class DateSettings extends React.PureComponent {
  componentDidMount() {
  }

  render() {
    return (
      <React.Fragment>
        <Section title={this.props.language.date.title} name='date'>
          settings
        </Section>
      </React.Fragment>
    );
  }
}