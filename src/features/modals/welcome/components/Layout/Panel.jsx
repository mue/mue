const Panel = ({ children, type }) => (
  <section className={type}>
    {type === 'content' ? (
      <div className="content">{children}</div>
    ) : type === 'aside' ? (
      <>{children}</>
    ) : (
      children
    )}
  </section>
);

export { Panel as default, Panel };
