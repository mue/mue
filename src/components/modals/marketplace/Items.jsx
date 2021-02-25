import React from 'react';

export default function Items(props) {
    if (props.items.length === 0) {
        return null; // if there are no items in category don't render it
    }

    let seeMoreHTML;
    if (props.seeMoreFunction && props.items.length === 3) {
        seeMoreHTML = <button className='addToMue seemore' onClick={props.seeMoreFunction}>{props.seeMoreTitle}</button>; // only render see more button if there are enough addons
    }

    return (
        <div>
            {seeMoreHTML}
            <h1>{props.title}</h1>
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
          </div>
    );
}