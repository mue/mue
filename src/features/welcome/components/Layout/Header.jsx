function Header({ title, subtitle }) {
  return (
    <>
      <span className="mainTitle">{title}</span>
      <span className="subtitle">
        {subtitle}
      </span>
    </>
  );
}

export { Header as default, Header };
