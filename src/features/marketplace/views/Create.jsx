import variables from 'config/variables';
import { MdOutlineExtensionOff } from 'react-icons/md';
import { Button } from 'components/Elements';

function Create() {
  return (
    <>
      <div className="flexTopMarketplace">
        <span className="mainTitle">{variables.getMessage('addons:create.title')}</span>
      </div>
      <div className="emptyItems">
        <div className="emptyNewMessage">
          <MdOutlineExtensionOff />
          <span className="title">
            {variables.getMessage('addons:create.moved_title')}
          </span>
          <span className="subtitle">
            {variables.getMessage('addons:create.moved_description')}
          </span>
          <div className="createButtons">
            <Button
              type="settings"
              label={variables.getMessage('addons:create.moved_button')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Create;
