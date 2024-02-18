const Panel = ({ children, type }) => (
  <section> {type === 'content' ? <div className="content">{children}</div> : children}</section>
);

export { Panel as default, Panel };
