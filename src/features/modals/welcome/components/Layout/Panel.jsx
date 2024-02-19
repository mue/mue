const Panel = ({ children, type }) => (
  <section className={type}>
    {children}
  </section>
);

export { Panel as default, Panel };
