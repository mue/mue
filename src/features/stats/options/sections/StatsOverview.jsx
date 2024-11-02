const StatsOverview = ({ stats }) => {
  const xpPercentage = Math.floor((stats.xp / stats.nextLevelXp) * 100);

  const ProgressCircle = ({ percentage }) => {
    const circleRadius = 50;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const progress = circleCircumference - (percentage / 100) * circleCircumference;

    return (
      <div className="relative flex items-center justify-center w-24 h-24 p-10">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-300"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-[#D21A11]"
            fill="none"
            strokeDasharray={circleCircumference}
            strokeDashoffset={progress}
          />
        </svg>
        <span className="absolute text-xl font-bold text-white">{percentage}%</span>
      </div>
    );
  };

  return (
    <div class="grid grid-cols-2 gap-10">
      <div className="bg-modal-content-light dark:bg-modal-content-dark py-6 px-10 rounded flex flex-row items-center">
        <ProgressCircle percentage={xpPercentage} />
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Level {stats.level || 1}</span>
          <span>{`${Math.round(stats.nextLevelXp - stats.xp) || 0} XP until next level`}</span>
        </div>
      </div>
      <div className="bg-modal-content-light dark:bg-modal-content-dark py-6 px-10 rounded flex flex-row items-center justify-center">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Streak</span>
          <span>{`${stats.streak?.current || 0} ${stats.streak?.current === 1 ? 'day' : 'days'}`}</span>
        </div>
      </div>
    </div>
  );
};

export { StatsOverview as default, StatsOverview };
