import variables from 'config/variables';
import { useState, useEffect } from 'react';

import { Header } from '../components/Layout';
import { MdOutlineWavingHand, MdOpenInNew } from 'react-icons/md';
import { FaDiscord, FaGithub } from 'react-icons/fa';

function Intro() {
const [welcomeImage, setWelcomeImage] = useState(0);

useEffect(() => {
    const timer = setInterval(() => {
      setWelcomeImage(prevWelcomeImage => prevWelcomeImage < 3 ? prevWelcomeImage + 1 : 0);
    }, 3000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [welcomeImage]);

  return (
    <>
      <Header title={variables.getMessage('modals.welcome.sections.intro.title')} />
      <div className="examples">
        <img
          src={`/src/assets/welcome-images/example${welcomeImage + 1}.webp`}
          alt="Example Mue setup"
          draggable={false}
        />
        <span className="shareYourMue">#shareyourmue</span>
      </div>
      <div className="welcomeNotice">
        <div className="icon">
          <MdOutlineWavingHand />
        </div>
        <div className="text">
          <span className="title">
            {variables.getMessage('modals.welcome.sections.intro.title')}
          </span>
          <span className="subtitle">
            {variables.getMessage('modals.welcome.sections.intro.description')}
          </span>
        </div>
      </div>
      <div className="welcomeNotice">
        <div className="icon">
          <FaDiscord />
        </div>
        <div className="text">
          <span className="title">
            {variables.getMessage('modals.welcome.sections.intro.notices.discord_title')}
          </span>
          <span className="subtitle">
            {variables.getMessage('modals.welcome.sections.intro.notices.discord_description')}
          </span>
        </div>
        <a href="https://discord.gg/zv8C9F8" target="_blank" rel="noopener noreferrer">
          <MdOpenInNew />{' '}
          {variables.getMessage('modals.welcome.sections.intro.notices.discord_join')}
        </a>
      </div>
      <div className="welcomeNotice">
        <div className="icon">
          <FaGithub />
        </div>
        <div className="text">
          <span className="title">
            {variables.getMessage('modals.welcome.sections.intro.notices.github_title')}
          </span>
          <span className="subtitle">
            {variables.getMessage('modals.welcome.sections.intro.notices.github_description')}
          </span>
        </div>
        <a href="https://github.com/mue/mue" target="_blank" rel="noopener noreferrer">
          <MdOpenInNew />
          {variables.getMessage('modals.welcome.sections.intro.notices.github_open')}
        </a>
      </div>
    </>
  );
}

export { Intro as default, Intro };
