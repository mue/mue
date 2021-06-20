export default function Items(props) {
  return (
    <div className='items'>
      {props.items.map((item) => (
        <div className='item' onClick={() => props.toggleFunction(item.name)} key={item.name}>
          <img alt='icon' draggable='false' src={window.constants.DDG_PROXY + item.icon_url} />
          <div className='details'>
            <h4>{item.display_name || item.name}</h4>
            <p>{item.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
