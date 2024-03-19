/* eslint-disable no-unused-vars */
import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdOutlineExtensionOff } from 'react-icons/md';
import { Button } from 'components/Elements';

export default class Create extends PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <>
        <div className="flexTopMarketplace">
          <span className="mainTitle">
            {variables.getMessage('modals.main.addons.create.title')}
          </span>
        </div>
        <div className="emptyItems">
          <div className="emptyNewMessage">
            <MdOutlineExtensionOff />
            <span className="title">
              {variables.getMessage('modals.main.addons.create.moved_title')}
            </span>
            <span className="subtitle">
              {variables.getMessage('modals.main.addons.create.moved_description')}
            </span>
            <div className="createButtons">
              <Button
                type="settings"
                label={variables.getMessage('modals.main.addons.create.moved_button')}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
