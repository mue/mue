import { MdArrowBackIosNew, MdArrowForwardIos, MdOutlinePreview } from 'react-icons/md';
import { Button } from 'components/Elements';
import variables from 'config/variables';

function Navigation({ currentTab, changeTab, buttonText, modalSkip }) {
  return (
    <div className="welcomeButtons">
      {currentTab !== 0 ? (
        <Button
          type="settings"
          onClick={() => changeTab(true)}
          icon={<MdArrowBackIosNew />}
          label={variables.getMessage('modals.welcome.buttons.previous')}
        />
      ) : (
        <Button
          type="settings"
          onClick={() => modalSkip()}
          icon={<MdOutlinePreview />}
          label={variables.getMessage('modals.welcome.buttons.preview')}
        />
      )}
      <Button
        type="settings"
        onClick={() => changeTab()}
        icon={<MdArrowForwardIos />}
        label={buttonText}
        iconPlacement={'right'}
      />
    </div>
  );
}

export { Navigation as default, Navigation };
