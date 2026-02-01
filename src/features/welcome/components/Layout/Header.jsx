function Header({ title, subtitle, children }) {
  return (
    <>
      <span className="mainTitle">{title}</span>
      <span className="subtitle">
        {subtitle}
        {subtitle && children ? ' ' : null}
        {children}
      </span>
    </>
  );
}

export { Header as default, Header };
