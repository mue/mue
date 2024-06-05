const Row = (props) => {
  const classes = `${props.final ? 'settingsRow settingsNoBorder' : 'settingsRow'} ${props.inactive ? 'opacity-50 pointer-events-none transition-400 ease-in-out' : ''}`;
  return <div className={classes}>{props.children}</div>;
};

const Content = (props) => {
  return (
    <div className="content">
      <span className="title">{props.title}</span>
      <span className="subtitle">{props.subtitle}</span>
    </div>
  );
};

const Action = (props) => {
  return <div className="action">{props.children}</div>;
};

export { Row, Content, Action };