import variables from 'modules/variables';

export default function Collection({
  items,
}) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <>
      <div className="items">
        {items.slice(0, 99).map((item) => (
          <div className="item" onClick={() => toggleFunction(item)} key={item.name}>
            <img
              alt="icon"
              draggable="false"
              src={variables.constants.DDG_IMAGE_PROXY + item.icon_url}
            />
            <div className="card-details">
              <span className="card-title">{item.display_name || item.name}</span>
              <span className="card-subtitle">{item.author}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="loader"></div>
    </>
  );
}
