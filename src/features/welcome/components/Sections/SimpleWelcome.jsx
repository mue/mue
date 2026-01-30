import variables from 'config/variables';
import { useState } from 'react';
import { Button } from 'components/Elements';
import EventBus from 'utils/eventbus';
import { FaDiscord, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

function SimpleWelcome({ modalClose, modalSkip }) {
  const [name, setName] = useState('');

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);

    // Live update localStorage and trigger greeting refresh
    if (newName.trim()) {
      localStorage.setItem('greetingName', newName.trim());
    } else {
      localStorage.removeItem('greetingName');
    }
    EventBus.emit('refresh', 'greeting');
  };

  const handleContinue = () => {
    // Name is already saved via live updates
    modalClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div className="simpleWelcomeContainer">
      <div className="welcomeContent">
        <div className="welcomeLogoSection">
          <img
            src="src/assets/icons/mue_about.png"
            alt="Mue"
            className="mueLogo"
            draggable={false}
          />
          {/* <h1 className="welcomeTitle">Welcome</h1> */}
        </div>

        <div className="welcomeNameSection">
          <label className="nameLabel">
            {variables.getMessage('modals.welcome.sections.intro.name_label')}
          </label>
          <input
            type="text"
            className="nameInput"
            placeholder={variables.getMessage('modals.welcome.sections.intro.name_placeholder')}
            value={name}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>

        <div className="welcomeActions">
          <button className="skipButton" onClick={modalSkip}>
            {variables.getMessage('modals.welcome.buttons.skip')}
          </button>
          <Button
            type="settings"
            label={variables.getMessage('modals.welcome.buttons.continue')}
            onClick={handleContinue}
          />
        </div>
      </div>

      <div className="welcomeCopyright">
        <div className="icons">
          <a
            href={`https://discord.com/${variables.constants.DISCORD_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord />
          </a>
          <a
            href={`https://github.com/${variables.constants.GITHUB_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href={`https://twitter.com/${variables.constants.TWITTER_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
        </div>
        <span>© {variables.getMessage('branding.author')}</span>
      </div>
    </div>
  );
}

export { SimpleWelcome as default, SimpleWelcome };
