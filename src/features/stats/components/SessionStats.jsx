import { useState, useEffect } from 'react';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import Stats from '../api/stats';
import variables from 'config/variables';

const SessionStats = () => {
  const [sessions, setSessions] = useState([]);
  const [orderBy, setOrderBy] = useState('startTime');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const loadSessions = async () => {
      const stats = await Stats.getAllSessionStats();
      setSessions(stats);
    };
    loadSessions();

    // Optional: Set up periodic refresh if needed
    const refreshInterval = setInterval(loadSessions, 30000); // Refresh every 30 seconds
    return () => clearInterval(refreshInterval);
  }, []);

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const multiplier = order === 'asc' ? 1 : -1;
    switch (orderBy) {
      case 'startTime':
        return multiplier * (new Date(a.startTime) - new Date(b.startTime));
      case 'duration':
        return multiplier * (a.duration - b.duration);
      case 'eventCount':
        return multiplier * (a.eventCount - b.eventCount);
      case 'totalXp':
        return multiplier * (a.totalXp - b.totalXp);
      default:
        return 0;
    }
  });

  const SortButton = ({ active, direction, onClick, children }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
    >
      {children}
      {active && (direction === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />)}
    </button>
  );

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#484848] bg-white/5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#484848]">
            <th className="p-4 text-left">
              <SortButton
                active={orderBy === 'startTime'}
                direction={order}
                onClick={() => handleSort('startTime')}
              >
                Session Start
              </SortButton>
            </th>
            <th className="p-4 text-left">
              <SortButton
                active={orderBy === 'duration'}
                direction={order}
                onClick={() => handleSort('duration')}
              >
                Duration
              </SortButton>
            </th>
            <th className="p-4 text-left">
              <SortButton
                active={orderBy === 'eventCount'}
                direction={order}
                onClick={() => handleSort('eventCount')}
              >
                Events
              </SortButton>
            </th>
            <th className="p-4 text-left">
              <SortButton
                active={orderBy === 'totalXp'}
                direction={order}
                onClick={() => handleSort('totalXp')}
              >
                XP Gained
              </SortButton>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#484848]">
          {sortedSessions.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-white/60">
                No sessions recorded yet
              </td>
            </tr>
          ) : (
            sortedSessions.map((session) => (
              <tr key={session.tabId} className="transition-colors hover:bg-white/5">
                <td className="p-4 text-sm">{formatDate(session.startTime)}</td>
                <td className="p-4 text-sm">{formatDuration(session.duration)}</td>
                <td className="p-4 text-sm">{session.eventCount}</td>
                <td className="p-4 text-sm">{session.totalXp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SessionStats;
