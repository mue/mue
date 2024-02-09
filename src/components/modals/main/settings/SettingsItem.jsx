function Row(props) {
  return (
    <div className={props.final ? 'settingsRow settingsNoBorder' : 'settingsRow'}>
      {props.children}
    </div>
  );
}

function Content(props) {
  return (
    <div className="content">
      <span className="title">{props.title}</span>
      <span className="subtitle">{props.subtitle}</span>
    </div>
  );
}

function Action(props) {
  return <div className="action">{props.children}</div>;
}

export { Row, Content, Action };
