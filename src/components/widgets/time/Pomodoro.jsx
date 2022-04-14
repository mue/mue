import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';

import { nth, convertTimezone } from 'modules/helpers/date';
import EventBus from 'modules/helpers/eventbus';
import Tooltip from '../../helpers/tooltip/Tooltip';
import { MdSkipNext, MdOutlineRestartAlt, MdPlayArrow, MdWork } from 'react-icons/md';

import './clock.scss';

export default function Pomodoro({ hours, minutes }) {
  return (
    <div className="pomodoro">
      <div className="pomodoroTime">
        <Tooltip title="Work Time">
          {' '}
          <span className="type">
            <MdWork />
          </span>
        </Tooltip>
        {/*<span>{localStorage.getItem('PomodoroBreakLength')}{localStorage.getItem('pomdoroWorkLength')}</span>*/}
      </div>
      <div className="pomodoroControls">
        <Tooltip title="Restart">
          <button onClick={() => this.favourite()}>
            <MdOutlineRestartAlt className="copyButton" />
          </button>
        </Tooltip>
        <Tooltip title="Resume">
          <button onClick={() => this.favourite()}>
            <MdPlayArrow className="copyButton" />
          </button>
        </Tooltip>
        <Tooltip title="Skip Stage">
          <button onClick={() => this.favourite()}>
            <MdSkipNext className="copyButton" />
          </button>
        </Tooltip>
      </div>
      <div className="pomdoroTime">
        <span className="timeRemaning">{localStorage.getItem('pomdoroWorkLength')}:00</span>
      </div>
    </div>
  );
}
