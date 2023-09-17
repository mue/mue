/* eslint-disable no-unused-vars */
import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdOutlineExtensionOff } from 'react-icons/md';

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
              <button> {variables.getMessage('modals.main.addons.create.moved_button')}</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
