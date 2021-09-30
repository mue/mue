import variables from 'modules/variables';

import { PureComponent } from 'react';

import Slider from './Slider';
import Switch from './Switch';

export default class Header extends PureComponent {
  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <h2>{this.props.title}</h2>
        <Switch name={this.props.setting} text={getMessage('modals.main.settings.enabled')} category={this.props.category} element={this.props.element || null} />
        {this.props.zoomSetting ? 
          <><Slider title={getMessage('modals.main.settings.sections.appearance.accessibility.widget_zoom')} name={this.props.zoomSetting} min='10' max='400' default='100' display='%' category={this.props.zoomCategory || this.props.category} /><br/><br/></>
        : null}
      </>
    );
  }
}
