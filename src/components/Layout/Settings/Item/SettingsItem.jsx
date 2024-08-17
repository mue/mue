const Row = (props) => {
  const classes = `${props.final ? 'border-b-0' : 'border-b border-gray-500'} ${props.inactive ? 'opacity-50 pointer-events-none transition duration-400 ease-in-out' : ''} flex items-center min-h-[100px] justify-between py-4 transition duration-400 ease-in-out`;
  return <div className={classes}>{props.children}</div>;
};

const Content = (props) => {
  return (
    <div className="flex flex-col max-w-[50%]">
      <span className="text-2xl font-semibold">{props.title}</span>
      <span className="text-neutral-800 dark:text-neutral-300 ">{props.subtitle}</span>
    </div>
  );
};

const Action = (props) => {
  return <div className="flex flex-col items-end w-[300px]">{props.children}</div>;
};

export { Row, Content, Action };
