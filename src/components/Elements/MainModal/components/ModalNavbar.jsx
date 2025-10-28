import variables from 'config/variables';
import { Button } from 'components/Elements';
import { NAVBAR_BUTTONS } from '../constants/tabConfig';

const ModalNavbar = ({ currentTab, onChangeTab }) => (
  <div className="modalNavbar">
    {NAVBAR_BUTTONS.map(({ tab, icon: Icon, messageKey }) => (
      <Button
        key={tab}
        type="navigation"
        onClick={() => onChangeTab(tab)}
        icon={<Icon />}
        label={variables.getMessage(messageKey)}
        active={currentTab === tab}
      />
    ))}
  </div>
);

export default ModalNavbar;
