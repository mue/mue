export default function Items({ items, toggleFunction }) {
  return (
    <div className='items'>
      {items.map((item) => (
        <div className='item' onClick={() => toggleFunction(item.name)} key={item.name}>
          <img alt='icon' draggable='false' src={variables.constants.DDG_IMAGE_PROXY + item.icon_url} />
          <div className='details'>
            <h4>{item.display_name || item.name}</h4>
            <p>{item.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
