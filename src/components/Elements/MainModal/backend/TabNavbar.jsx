import React from 'react';
import {
  MdSettings,
  MdOutlineShoppingBasket,
  MdSpaceDashboard,
  MdOutlineKeyboardArrowRight,
  MdClose,
  MdSearch,
} from 'react-icons/md';
import { IoMdPricetag } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { useTab } from './TabContext';
import { Tooltip } from 'components/Elements';
import variables from 'config/variables';
import clsx from 'clsx';

const TabNavbar = ({ modalClose }) => {
  const { activeTab, subTab, changeTab, subSection, setSubTab, setSubSection } = useTab();

  const tabs = [
    { id: 'settings', label: 'Settings', icon: <MdSettings /> },
    { id: 'addons', label: 'Addons', icon: <MdSpaceDashboard /> },
    { id: 'marketplace', label: 'Marketplace', icon: <IoMdPricetag /> },
  ];

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
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
          <stop stopColor="#FF5C25" />
          <stop offset="0.484375" stopColor="#D21A11" />
          <stop offset="1" stopColor="#FF456E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2473_27"
          x1="76.8303"
          y1="60.1055"
          x2="76.8303"
          y2="43.1796"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F18D91" />
          <stop offset="1" stopColor="#FBD3C6" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2473_27"
          x1="65.123"
          y1="72.0938"
          x2="65.123"
          y2="45.5766"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F18D91" />
          <stop offset="1" stopColor="#FBD3C6" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2473_27"
          x1="60.1895"
          y1="77.0352"
          x2="60.1895"
          y2="50.518"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F18D91" />
          <stop offset="1" stopColor="#FBD3C6" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_2473_27"
          x1="55.252"
          y1="81.9688"
          x2="55.252"
          y2="55.4516"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F18D91" />
          <stop offset="1" stopColor="#FBD3C6" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="flex flex-row gap-5 p-5 items-center justify-between">
      <div className="flex flex-row gap-5 items-center">
        {navbarLogo}
        <div className="flex flex-row items-center gap-2">
          <span
            onClick={() => changeTab(activeTab)}
            className={clsx(
              'text-xl capitalize tracking-normal transition-all duration-150 ease-in-out',
              {
                'text-neutral-300 cursor-pointer hover:text-neutral-100':
                  subTab !== '' && activeTab === 'marketplace',
              },
            )}
          >
            {variables.getMessage(`modals.main.navbar.${activeTab}`)}
          </span>
          {subTab !== '' && (
            <>
              <MdOutlineKeyboardArrowRight />
              <span
                onClick={() => setSubSection('')}
                className={clsx(
                  'text-xl capitalize tracking-normal transition-all duration-150 ease-in-out',
                  { 'text-neutral-300 cursor-pointer hover:text-neutral-100': subSection !== '' },
                )}
              >
                {subTab}
              </span>
            </>
          )}
          {subSection !== '' && (
            <>
              <MdOutlineKeyboardArrowRight />
              <span className="text-xl capitalize tracking-normal">{subSection}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-5">
        <AnimatePresence>
          {activeTab === 'marketplace' && subTab === '' && (
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
            >
              <form className="max-w-md mx-auto relative mr-10">
                <input
                  label={variables.getMessage('widgets.search')}
                  placeholder={variables.getMessage('widgets.search')}
                  name="filter"
                  id="filter"
                  className="h-[40px] block w-full px-4 ps-10 text-sm text-gray-900 border border-[#484848] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-neutral-100"
                />
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <MdSearch />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className={`${
                activeTab === tab.id ? '' : 'hover:text-white/70'
              } transition-all duration-800	ease-in-out flex flex-row gap-2 items-center relative rounded-sm px-3 py-1.5 text-sm text-white outline-sky-400 transition focus-visible:outline-2`}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="tabNavbarBubble"
                  className="absolute inset-0 z-10 bg-[#333] mix-blend-lighten rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.icon}
              {variables.getMessage(`modals.main.navbar.${tab.id}`)}
              {tab.id === 'addons' && (
                <span className="px-3 py-1 bg-[#424242] rounded-lg text-xs">
                  {(JSON.parse(localStorage.getItem('installed')) || []).length}
                </span>
              )}
              {tab.id === 'marketplace' && (
                <span className="px-3 py-1 bg-rose-800 rounded-lg text-xs border border-rose-700">
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>
        <Tooltip
          style={{ marginLeft: 'auto', justifySelf: 'flex-end' }}
          title={variables.getMessage('welcome:buttons.close')}
          key="closeTooltip"
        >
          <span className="closeModal" onClick={modalClose}>
            <MdClose />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export { TabNavbar as default, TabNavbar };
