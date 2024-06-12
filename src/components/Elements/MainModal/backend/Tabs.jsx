import variables from 'config/variables';
import React, { useState, useEffect } from 'react';
import {
  MdSettings,
  MdOutlineShoppingBasket,
  MdOutlineExtension,
  MdRefresh,
  MdClose,
} from 'react-icons/md';
import Tab from './Tab';
import { Button, Tooltip } from 'components/Elements';
import ErrorBoundary from '../../../../features/misc/modals/ErrorBoundary';

const Tabs = (props) => {
  const [currentTab, setCurrentTab] = useState(props.children[0].props.label);
  const [currentName, setCurrentName] = useState(props.children[0].props.name);

  const onClick = (tab, name) => {
    if (name !== currentName) {
      variables.stats.postEvent('tab', `Opened ${name}`);
    }

    setCurrentTab(tab);
    setCurrentName(name);
  };

  const hideReminder = () => {
    localStorage.setItem('showReminder', false);
    document.querySelector('.reminder-info').style.display = 'none';
  };

  const navbarButtons = [
    {
      tab: 'settings',
      icon: <MdSettings />,
    },
    {
      tab: 'addons',
      icon: <MdOutlineExtension />,
    },
    {
      tab: 'marketplace',
      icon: <MdOutlineShoppingBasket />,
    },
  ];

  const reminderInfo = (
    <div
      className="reminder-info"
      style={{ display: localStorage.getItem('showReminder') === 'true' ? 'flex' : 'none' }}
    >
      <div className="shareHeader">
        <span className="title">{variables.getMessage('modals.main.settings.reminder.title')}</span>
        <span className="closeModal" onClick={hideReminder}>
          <MdClose />
        </span>
      </div>
      <span className="subtitle">
        {variables.getMessage('modals.main.settings.reminder.message')}
      </span>
      <button onClick={() => window.location.reload()}>
        <MdRefresh />
        {variables.getMessage('modals.main.error_boundary.refresh')}
      </button>
    </div>
  );

  const navbarLogo = (
    <svg
      width="123"
      height="123"
      viewBox="0 0 123 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[40px] h-[40px]"
    >
      <g filter="url(#filter0_d_2473_27)">
        <circle cx="61.5" cy="61.5" r="50.5" fill="url(#paint0_linear_2473_27)" />
        <path
          d="M68.2969 43.1796V48.5603H79.9348V60.1055H85.3638V43.1796H68.2969Z"
          fill="url(#paint1_linear_2473_27)"
        />
        <path
          d="M72.1542 61.0483H67.344V65.8527H62.9056V61.0483H58.0919V56.6185H62.9056V51.8175H67.344V56.6185H72.1542V61.0483ZM78.6447 49.6043H67.034V45.5766H47.5625V72.0938H82.6836V61.1961H78.6447V49.6043Z"
          fill="url(#paint2_linear_2473_27)"
        />
        <path
          d="M46.358 50.518H42.6289V77.0352H77.75V73.3029H46.358V50.518Z"
          fill="url(#paint3_linear_2473_27)"
        />
        <path
          d="M41.4205 55.4516H37.6914V81.9688H72.8125V78.2365H41.4205V55.4516Z"
          fill="url(#paint4_linear_2473_27)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2473_27"
          x="0.3"
          y="0.3"
          width="122.4"
          height="122.4"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5.35" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2473_27" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2473_27"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_2473_27"
          x1="104.324"
          y1="35.24"
          x2="16.959"
          y2="88.366"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF5C25" />
          <stop offset="0.484375" stop-color="#D21A11" />
          <stop offset="1" stop-color="#FF456E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2473_27"
          x1="76.8303"
          y1="60.1055"
          x2="76.8303"
          y2="43.1796"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F18D91" />
          <stop offset="1" stop-color="#FBD3C6" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2473_27"
          x1="65.123"
          y1="72.0938"
          x2="65.123"
          y2="45.5766"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F18D91" />
          <stop offset="1" stop-color="#FBD3C6" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2473_27"
          x1="60.1895"
          y1="77.0352"
          x2="60.1895"
          y2="50.518"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F18D91" />
          <stop offset="1" stop-color="#FBD3C6" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_2473_27"
          x1="55.252"
          y1="81.9688"
          x2="55.252"
          y2="55.4516"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F18D91" />
          <stop offset="1" stop-color="#FBD3C6" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="flex flex-col w-[100%] min-w-[100%]">
      <div className="flex flex-row gap-5 p-5 items-center">
        {navbarLogo}
        {/*<span className="text-2xl font-bold">{currentTab}</span>*/}
        <div
          className="flex flex-row gap-5"
          style={{ marginLeft: 'auto', justifySelf: 'flex-end' }}
        >
          {navbarButtons.map(({ tab, icon }, index) => (
            <Button
              type="navigation"
              onClick={() => props.changeTab(tab)}
              icon={icon}
              label={variables.getMessage(`modals.main.navbar.${tab}`)}
              active={props.current === tab}
              key={`${tab}-${index}`}
            />
          ))}
          <Tooltip
            style={{ marginLeft: 'auto', justifySelf: 'flex-end' }}
            title={variables.getMessage('modals.welcome.buttons.close')}
            key="closeTooltip"
          >
            <span className="closeModal" onClick={props.modalClose}>
              <MdClose />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="flex w-[100%] min-w-[100%]">
        {props.current === 'settings' && (
          <div className="modalSidebar">
            {props.children.map((tab, index) => (
              <Tab
                currentTab={currentTab}
                key={index}
                label={tab.props.label}
                onClick={(nextTab) => onClick(nextTab, tab.props.name)}
                navbarTab={props.navbar || false}
              />
            ))}
            {reminderInfo}
          </div>
        )}
        <div className="modalTabContent">
          {props.children.map((tab, index) => {
            if (tab.props.label !== currentTab) {
              return undefined;
            }

            return (
              <ErrorBoundary key={`error-boundary-${index}`}>{tab.props.children}</ErrorBoundary>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
