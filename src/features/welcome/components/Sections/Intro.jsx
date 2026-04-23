import { useT } from 'contexts';
import variables from 'config/variables';
import { useState, useEffect, useCallback } from 'react';

import example1 from 'assets/welcome-images/example1.webp';
import example2 from 'assets/welcome-images/example2.webp';
import example3 from 'assets/welcome-images/example3.webp';
import example4 from 'assets/welcome-images/example4.webp';

import { Header, Content } from '../Layout';
import { MdOutlineWavingHand, MdOpenInNew } from 'react-icons/md';
import { FaDiscord, FaGithub } from 'react-icons/fa';

const DISCORD_LINK = 'https://discord.gg/' + variables.constants.DISCORD_SERVER;
const GITHUB_LINK =
  'https://github.com/' + variables.constants.ORG_NAME + '/' + variables.constants.REPO_NAME;

function WelcomeNotice({ config }) {
  const t = useT();
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
          {t('modals.welcome.sections.intro.notices.github_open')}
        </a>
      )}
    </div>
  );
}

const welcomeImages = [example1, example2, example3, example4];

function Intro() {
  const [welcomeImage, setWelcomeImage] = useState(0);

  const updateWelcomeImage = useCallback(() => {
    setWelcomeImage((prevWelcomeImage) => (prevWelcomeImage < 3 ? prevWelcomeImage + 1 : 0));
  }, []);

  const ShareYourMue = (
    <div className="examples">
      <img
        src={welcomeImages[welcomeImage]}
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
      <Header title={t('modals.welcome.sections.intro.title')} />
      {ShareYourMue}
      <WelcomeNotice
        config={{
          icon: MdOutlineWavingHand,
          title: t('modals.welcome.sections.intro.title'),
          subtitle: t('modals.welcome.sections.intro.description'),
        }}
      />
      <WelcomeNotice
        config={{
          icon: FaDiscord,
          title: t('modals.welcome.sections.intro.notices.discord_title'),
          subtitle: t('modals.welcome.sections.intro.notices.discord_description'),
          link: DISCORD_LINK,
        }}
      />
      <WelcomeNotice
        config={{
          icon: FaGithub,
          title: t('modals.welcome.sections.intro.notices.github_title'),
          subtitle: t('modals.welcome.sections.intro.notices.github_description'),
          link: GITHUB_LINK,
        }}
      />
    </Content>
  );
}

export { Intro as default, Intro };
