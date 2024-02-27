import variables from 'config/variables';
import { useState, useEffect, useCallback } from 'react';

import { Header, Content } from '../components/Layout';
import { MdOutlineWavingHand, MdOpenInNew } from 'react-icons/md';
import { FaDiscord, FaGithub } from 'react-icons/fa';

const DISCORD_LINK = 'https://discord.gg/' + variables.constants.DISCORD_SERVER;
const GITHUB_LINK =
  'https://github.com/' + variables.constants.ORG_NAME + '/' + variables.constants.REPO_NAME;

function WelcomeNotice({ config }) {
  const { icon: Icon, title, subtitle, link } = config;
  return (
    <div className="welcomeNotice">
      <div className="icon">
        <Icon />
      </div>
      <div className="text">
        <span className="title">{title}</span>
        <span className="subtitle">{subtitle}</span>
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <MdOpenInNew />
          {variables.getMessage('modals.welcome.sections.intro.notices.github_open')}
        </a>
      )}
    </div>
  );
}

function Intro() {
  const [welcomeImage, setWelcomeImage] = useState(0);

  const updateWelcomeImage = useCallback(() => {
    setWelcomeImage((prevWelcomeImage) => (prevWelcomeImage < 3 ? prevWelcomeImage + 1 : 0));
  }, []);

  const ShareYourMue = (
    <div className="examples">
      <img
        src={`/src/assets/welcome-images/example${welcomeImage + 1}.webp`}
        alt="Example Mue setup"
        draggable={false}
      />
      <span className="shareYourMue">#shareyourmue</span>
    </div>
  );

  useEffect(() => {
    const timer = setInterval(updateWelcomeImage, 3000);
    return () => clearInterval(timer);
  }, [updateWelcomeImage]);

  return (
    <Content>
      <Header title={variables.getMessage('modals.welcome.sections.intro.title')} />
      {ShareYourMue}
      <WelcomeNotice
        config={{
          icon: MdOutlineWavingHand,
          title: variables.getMessage('modals.welcome.sections.intro.title'),
          subtitle: variables.getMessage('modals.welcome.sections.intro.description'),
        }}
      />
      <WelcomeNotice
        config={{
          icon: FaDiscord,
          title: variables.getMessage('modals.welcome.sections.intro.notices.discord_title'),
          subtitle: variables.getMessage(
            'modals.welcome.sections.intro.notices.discord_description',
          ),
          link: DISCORD_LINK,
        }}
      />
      <WelcomeNotice
        config={{
          icon: FaGithub,
          title: variables.getMessage('modals.welcome.sections.intro.notices.github_title'),
          subtitle: variables.getMessage(
            'modals.welcome.sections.intro.notices.github_description',
          ),
          link: GITHUB_LINK,
        }}
      />
    </Content>
  );
}

export { Intro as default, Intro };
