import React, { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
import { MdShowChart } from 'react-icons/md';
import Stats from 'features/stats/api/stats';

const StatsDashboard = ({ stats, variables, STATS_SECTION }) => {
  const [timeView, setTimeView] = useState('week');
  const [data, setData] = useState([]);
  const [filteredStats, setFilteredStats] = useState({});
  const [xpBetweenDates, setXpBetweenDates] = useState(0);

  const CENTER_X = 250;
  const CENTER_Y = 250;
  const RADIUS = 200;
  const INNER_RADIUS = 30;

  useEffect(() => {
    const parseData = async (timeView) => {
      const now = new Date();
      let startDate, endDate;

      switch (timeView) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'yesterday':
          startDate = new Date(now.setDate(now.getDate() - 1));
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          endDate = new Date();
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          endDate = new Date();
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          endDate = new Date();
          break;
        default:
          break;
      }

      const filteredEvents = await Stats.getStats(null, null, null, startDate, endDate);

      const data = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: 0,
      }));

      filteredEvents.forEach((event) => {
        const date = new Date(event.timestamp);
        const hour = date.getHours();
        data[hour].count += 1;
      });

      const filteredStats = {
        'xp-earned': await Stats.calculateXpBetweenDates(startDate, endDate),
        'new-tab': (await Stats.getStats('new-tab', null, null, startDate, endDate)).length,
        'background-favourite': (
          await Stats.getStats('background-favourite', null, null, startDate, endDate)
        ).length,
        'background-download': (
          await Stats.getStats('background-download', null, null, startDate, endDate)
        ).length,
        'quoted-favourite': (
          await Stats.getStats('quoted-favourite', null, null, startDate, endDate)
        ).length,
        'quicklink-add': (await Stats.getStats('quicklink-add', null, null, startDate, endDate))
          .length,
        setting: (await Stats.getStats('setting', null, null, startDate, endDate)).length,
        'marketplace-install': (
          await Stats.getStats('marketplace-install', null, null, startDate, endDate)
        ).length,
        'quotes-shown': (await Stats.getStats('feature', 'quote', 'shown', startDate, endDate))
          .length,
        'backgrounds-shown': (
          await Stats.getStats('feature', 'background-image', 'shown', startDate, endDate)
        ).length,
        level: stats.level || 1,
        xp: stats.currentLevelXp || 0,
        nextLevelXp: stats.nextLevelXp || 100,
        totalXp: stats.totalXp || 0,
        streak: stats.streak?.current || 0,
      };

      const xpBetweenDates = await Stats.calculateXpBetweenDates(startDate, endDate);

      return { data, filteredStats, xpBetweenDates };
    };

    const fetchData = async () => {
      const { data, filteredStats, xpBetweenDates } = await parseData(timeView);
      setData(data);
      setFilteredStats(filteredStats);
      setXpBetweenDates(xpBetweenDates);
    };

    fetchData();
  }, [timeView, stats]);

  const renderClock = () => {
    const elements = [];
    const maxCount = Math.max(...data.map((d) => d.count));

    for (let hour = 0; hour < 24; hour++) {
      const angleRad = (hour * 15 - 90) * (Math.PI / 180);
      const nextAngleRad = ((hour + 1) * 15 - 90) * (Math.PI / 180);

      // Spoke line
      const spokeEndX = CENTER_X + Math.cos(angleRad) * RADIUS;
      const spokeEndY = CENTER_Y + Math.sin(angleRad) * RADIUS;
      elements.push(
        <line
          key={`spoke-${hour}`}
          x1={CENTER_X}
          y1={CENTER_Y}
          x2={spokeEndX}
          y2={spokeEndY}
          stroke="#ffffff"
          strokeWidth={1}
        />,
      );

      // Hour number
      const numberRadius = RADIUS + 20;
      const numberX = CENTER_X + Math.cos(angleRad) * numberRadius;
      const numberY = CENTER_Y + Math.sin(angleRad) * numberRadius;
      elements.push(
        <text
          key={`hour-${hour}`}
          x={numberX}
          y={numberY}
          fill="#ffffff"
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {hour}
        </text>,
      );

      // Activity sector
      if (data[hour] && data[hour].count > 0) {
        const sectorRadius = INNER_RADIUS + ((RADIUS - INNER_RADIUS) * data[hour].count) / maxCount;
        const startX = CENTER_X + Math.cos(angleRad) * INNER_RADIUS;
        const startY = CENTER_Y + Math.sin(angleRad) * INNER_RADIUS;
        const endX = CENTER_X + Math.cos(nextAngleRad) * INNER_RADIUS;
        const endY = CENTER_Y + Math.sin(nextAngleRad) * INNER_RADIUS;
        const outerStartX = CENTER_X + Math.cos(angleRad) * sectorRadius;
        const outerStartY = CENTER_Y + Math.sin(angleRad) * sectorRadius;
        const outerEndX = CENTER_X + Math.cos(nextAngleRad) * sectorRadius;
        const outerEndY = CENTER_Y + Math.sin(nextAngleRad) * sectorRadius;

        const pathData = `
          M ${startX} ${startY}
          L ${outerStartX} ${outerStartY}
          A ${sectorRadius} ${sectorRadius} 0 0 1 ${outerEndX} ${outerEndY}
          L ${endX} ${endY}
          A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${startX} ${startY}
          Z
        `;

        elements.push(
          <path
            key={`sector-${hour}`}
            d={pathData}
            fill="#D21A11"
            stroke="none"
            title={`Hour: ${hour}, Tabs Opened: ${data[hour].count}`}
          />,
        );
      }
    }

    return elements;
  };

  const StatsElement = ({ title, value }) => (
    <div className="flex flex-col">
      <span className="text-3xl">{value}</span>
      <span className="text-xs text-neutral-400 leading-tight lowercase">{title}</span>
    </div>
  );

  return (
    <div>
      <div className="flex flex-row justify-between mb-4 items-center">
        <span className="text-2xl font-semibold pb-5">Statistics</span>
        <div className="flex flex-row">
          {['today', 'yesterday', 'week', 'month', 'year'].map((view) => (
            <button
              key={view}
              className={`btn-view px-5 py-2 mx-1 rounded ${
                timeView === view
                  ? 'bg-white text-black'
                  : 'bg-modal-content-light dark:bg-modal-content-dark text-white'
              }`}
              onClick={() => setTimeView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 items-center">
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={400}>
            <svg viewBox="0 0 500 500">
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={INNER_RADIUS}
                fill="#111111"
                stroke="#333333"
                strokeWidth="1"
              />
              {renderClock()}
            </svg>
          </ResponsiveContainer>
        </div>
        <div className="bg-modal-content-light dark:bg-modal-content-dark my-5 p-10 rounded">
          <div className="grid grid-cols-2 gap-10">
            <StatsElement title="XP Earned" value={filteredStats['xp-earned'] || 0} />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.tabs_opened`)}
              value={filteredStats['new-tab'] || 0}
            />
            <StatsElement title="Quotes Shown" value={filteredStats['quotes-shown'] || 0} />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.settings_changed`)}
              value={filteredStats.setting || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.addons_installed`)}
              value={filteredStats['marketplace-install'] || 0}
            />
            <StatsElement
              title="Background Images Shown"
              value={filteredStats['backgrounds-shown'] || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.backgrounds_favourited`)}
              value={filteredStats['background-favourite'] || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.backgrounds_downloaded`)}
              value={filteredStats['background-download'] || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.quotes_favourited`)}
              value={filteredStats['quoted-favourite'] || 0}
            />
            <StatsElement
              title={variables.getMessage(`${STATS_SECTION}.sections.quicklinks_added`)}
              value={filteredStats['quicklink-add'] || 0}
            />
          </div>
        </div>
      </div>
      <div className="bg-modal-content-light dark:bg-modal-content-dark my-5 p-10 rounded flex flex-row justify-around">
        <StatsElement title="Total XP" value={filteredStats.totalXp || 0} />
        <StatsElement title="XP" value={filteredStats.xp || 0} />
        <StatsElement title="Next level XP" value={filteredStats.nextLevelXp || 100} />
      </div>
    </div>
  );
};

export default StatsDashboard;
