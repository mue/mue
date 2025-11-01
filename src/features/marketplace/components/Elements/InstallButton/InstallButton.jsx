import { memo } from 'react';
import { MdClose } from 'react-icons/md';
import './installButton.scss';

const MueLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mueLogo"
  >
    <circle cx="250" cy="250" r="250" fill="url(#paint0_linear_1870_2)" />
    <path
      d="M291.02 132.002V164.879H362.13V235.422H395.302V132.002H291.02Z"
      fill="url(#paint1_linear_1870_2)"
    />
    <path
      d="M314.592 241.186H285.201V270.542H258.081V241.186H228.669V214.119H258.081V184.784H285.201V214.119H314.592V241.186ZM354.25 171.261H283.307V146.651H164.332V308.676H378.929V242.089H354.25V171.261Z"
      fill="url(#paint2_linear_1870_2)"
    />
    <path
      d="M156.949 176.811H134.164V338.836H348.761V316.031H156.949V176.811Z"
      fill="url(#paint3_linear_1870_2)"
    />
    <path
      d="M126.785 206.975H104V369H318.597V346.195H126.785V206.975Z"
      fill="url(#paint4_linear_1870_2)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1870_2"
        x1="462"
        y1="120"
        x2="29.5"
        y2="383"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF5C25" />
        <stop offset="0.484375" stopColor="#D21A11" />
        <stop offset="1" stopColor="#FF456E" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_1870_2"
        x1="343.161"
        y1="235.422"
        x2="343.161"
        y2="132.002"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F18D91" />
        <stop offset="1" stopColor="#FBD3C6" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_1870_2"
        x1="271.631"
        y1="308.676"
        x2="271.631"
        y2="146.651"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F18D91" />
        <stop offset="1" stopColor="#FBD3C6" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_1870_2"
        x1="241.463"
        y1="338.836"
        x2="241.463"
        y2="176.811"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F18D91" />
        <stop offset="1" stopColor="#FBD3C6" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_1870_2"
        x1="211.298"
        y1="369"
        x2="211.298"
        y2="206.975"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F18D91" />
        <stop offset="1" stopColor="#FBD3C6" />
      </linearGradient>
    </defs>
  </svg>
);

const InstallButton = ({ onClick, isInstalled, label }) => {
  return (
    <button
      className={`installButton ${isInstalled ? 'installed' : 'notInstalled'}`}
      onClick={onClick}
    >
      <span className="buttonContent">
        <span className="labelText">{label}</span>
        <span className="iconWrapper">
          <span className={`icon installIcon ${isInstalled ? 'hide' : 'show'}`}>
            <MueLogo />
          </span>
          <span className={`icon removeIcon ${isInstalled ? 'show' : 'hide'}`}>
            <MdClose />
          </span>
        </span>
      </span>
    </button>
  );
};

export default memo(InstallButton);
