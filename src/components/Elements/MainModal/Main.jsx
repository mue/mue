import variables from 'config/variables';
import { Suspense, lazy, useState, memo } from 'react';
import { MdSettings, MdOutlineShoppingBasket, MdOutlineExtension, MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'components/Elements';

import './scss/index.scss';
import { Tooltip } from 'components/Elements';
/*import Settings from '../../../features/misc/views/Settings';
import Addons from '../../../features/misc/views/Addons';
import Marketplace from '../../../features/misc/views/Marketplace';*/

const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Addons = lazy(() => import('../../../features/misc/views/Addons'));
const Marketplace = lazy(() => import('../../../features/misc/views/Marketplace'));

const renderLoader = () => (
  <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
    <div className="modalSidebar">
      <span className="mainTitle">Mue</span>
    </div>
    <div className="modalTabContent">
      <div className="emptyItems">
        <div className="emptyMessage">
          <div className="loaderHolder">
            <div id="loader"></div>
            <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
          </div>
        </div>
      </div>
    </div>
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
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2473_27" result="shape" />
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

let tabs = [
  { id: 'settings', label: 'Settings', icon: <MdSettings /> },
  { id: 'addons', label: 'Addons', icon: <MdOutlineExtension /> },
  { id: 'marketplace', label: 'Marketplace', icon: <MdOutlineShoppingBasket /> },
];

function MainModal({ modalClose }) {
  let [activeTab, setActiveTab] = useState(tabs[0].id);
  let [subTab, setSubTab] = useState("");
  let [direction, setDirection] = useState(1);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      overflow: 'none',
      top: '80px',
      position: 'absolute',
      width: '100%',
    }),
    center: {
      x: 0,
      opacity: 1,
      overflow: 'none',
      top: '80px',
      position: 'absolute',
      width: '100%',
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      overflow: 'none',
      top: '80px',
      position: 'absolute',
      width: '100%',
    }),
  };

  const changeTab = (type) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const newIndex = tabs.findIndex((tab) => tab.id === type);

    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(type);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'addons':
        return <Addons modalClose={modalClose} />;
      case 'marketplace':
        return <Marketplace modalClose={modalClose} />;
      default:
        return <Settings setSubTab={setSubTab} modalClose={modalClose} />;
    }
  };

  return (
    <>
      <div className="flex flex-col w-[100%] min-w-[100%]">
        <div className="flex flex-row gap-5 p-5 items-center">
          {navbarLogo}
          <span className="text-xl capitalize tracking-normal">{subTab}</span>
          <div
            className="flex flex-row gap-5"
            style={{ marginLeft: 'auto', justifySelf: 'flex-end' }}
          >
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => changeTab(tab.id)}
                  className={`${
                    activeTab === tab.id ? '' : 'hover:text-white/60'
                  } flex flex-row gap-5 items-center relative rounded-sm px-3 py-1.5 text-sm text-white outline-sky-400 transition focus-visible:outline-2`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 z-10 bg-[#333] mix-blend-lighten rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {tab.icon}
                  {variables.getMessage(`modals.main.navbar.${tab.id}`)}
                </button>
              ))}
            </div>
            <Tooltip
              style={{ marginLeft: 'auto', justifySelf: 'flex-end' }}
              title={variables.getMessage('modals.welcome.buttons.close')}
              key="closeTooltip"
            >
              <span className="closeModal" onClick={modalClose}>
                <MdClose />
              </span>
            </Tooltip>
          </div>
        </div>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.8 }}
            className="flex w-[100%] min-w-[100%]"
          >
            <Suspense fallback={renderLoader()}>{renderTab()}</Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

const MemoizedMainModal = memo(MainModal);
export { MemoizedMainModal as default, MemoizedMainModal as MainModal };
