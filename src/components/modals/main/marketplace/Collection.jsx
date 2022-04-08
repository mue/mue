import variables from "modules/variables";

export default function Collection({ items, toggleFunction }) {
  return [
    <div className='collection starWars'>
    <div className='content'>
    <div className="tags">
          <div className="tag">
            <span>Star Wars</span>
          </div>
        </div>
      <span className='title'>Star Wars Collection</span>
      <span className='subtitle'>A Collection of stuff inspired by the film franchise star wars..</span>
      <button>Explore Collection</button>
    </div>
  </div>,
      <div className="items">
      {items.map((item) => (
        <div
          className="item"
          onClick={() => toggleFunction(item)}
          key={item.name}
        >
          <img
            alt="icon"
            draggable="false"
            src={variables.constants.DDG_IMAGE_PROXY + item.icon_url}
          />
          <div className="card-details">
            <span className="card-title">{item.display_name || item.name}</span>
            <span className="card-subtitle">{item.author}</span>
            <div className="tags">
              <div className="tag">
                <span>{item.author}</span>
              </div>
              <div className='moreTag'>
                <span>1</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>,
  ];
}
