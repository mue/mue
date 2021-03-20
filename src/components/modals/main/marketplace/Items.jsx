import React from 'react';

export default function Items(props) {
  // todo: add message here
  if (props.items.length === 0) {
    return null;
  }

  return (
    <div className='items'>
      {props.items.map((item) =>
      <div className='item' onClick={() => props.toggleFunction(item.name)} key={item.name}>
        <img alt='icon' draggable={false} src={'https://external-content.duckduckgo.com/iu/?u=' + item.icon_url} />
        <div className='details'>
          <h4>{item.display_name ? item.display_name : item.name}</h4>
          <p>{item.author}</p>
        </div>
      </div>)}
    </div>
  );
}
