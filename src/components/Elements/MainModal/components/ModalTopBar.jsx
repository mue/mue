import variables from 'config/variables';
import { MdClose } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';
import { NAVBAR_BUTTONS } from '../constants/tabConfig';

function ModalTopBar({ currentTab, onTabChange, onClose }) {
  return (
    <div className="modalTopBar">
      <div className="topBarLeft">
        <img
          src="src/assets/icons/mue_about.png"
          alt="Mue"
          className="topBarLogo"
          draggable={false}
        />
      </div>
      <div className="topBarRight">
        <div className="topBarNavigation">
          {NAVBAR_BUTTONS.map(({ tab, icon: Icon, messageKey }) => (
            <Button
              key={tab}
              type="navigation"
              onClick={() => onTabChange(tab)}
              active={currentTab === tab}
              icon={<Icon />}
              label={variables.getMessage(messageKey)}
            />
          ))}
        </div>
        <Tooltip title={variables.getMessage('modals.welcome.buttons.close')} key="closeTooltip">
          <span className="closeModal" onClick={onClose}>
            <MdClose />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

export default ModalTopBar;
