import variables from 'config/variables';
import { useEffect, useState } from 'react';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { MdCheckCircle, MdOpenInNew } from 'react-icons/md';

function ItemCard({ item, type, onCollection, isCurator, cardStyle }) {
  const { getItemData, installedItems } = useMarketData();
  const { setSubTab } = useTab();
  let installed = '';

  item._onCollection = onCollection;

  const getName = (name) => {
    const nameMappings = {
      photos: 'photo_packs',
      quotes: 'quote_packs',
      settings: 'preset_settings',
    };
    return nameMappings[name] || name;
  };

  const SelectItem = () => {
    getItemData(getName(item.type), item.name).then((data) => {
      setSubTab(data.display_name);
    });
  };

  const isItemInstalled = (itemName) => {
    return installedItems.some((item) => item.name === itemName);
  };

  switch (cardStyle) {
    case 'list':
      return (
        <tr
          key={item.name}
          className="hover:bg-white/5 rounded-lg cursor-pointer transition duration-300 ease-in-out"
          onClick={SelectItem}
        >
          <td className="flex flex-row items-center gap-10 py-3">
            <img
              className="w-10 h-10 rounded-lg"
              alt="icon"
              draggable={false}
              src={item.icon_url}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderIcon;
              }}
            />
            <div className="flex flex-col">
              <span className="text-base font-normal">{item.display_name}</span>
              <span className="text-xs text-neutral-400">{item.author}</span>
            </div>
          </td>
          <td className="text-base text-neutral-300 font-light py-3">
            {variables.getMessage('marketplace:' + getName(item.type)) || 'marketplace'}
          </td>
          <td className="flex items-center h-[55px] text-xl py-3">
            <div className="flex flex-row gap-5 items-center">
              <MdOpenInNew />
              {isItemInstalled(item.name) && <MdCheckCircle className="text-rose-600" />}
            </div>
          </td>
        </tr>
      );
    default:
      const gradient_var_0 = `--item-${item.name.replaceAll('_', '-')}-gradient0`;
      const gradient_var_10 = `--item-${item.name.replaceAll('_', '-')}-gradient10`;
      const gradient_var_75 = `--item-${item.name.replaceAll('_', '-')}-gradient75`;
      const gradient_var_100 = `--item-${item.name.replaceAll('_', '-')}-gradient100`;
      const initial_colour_0 = item.colour + '60';
      const initial_colour_10 = item.colour + '58'; // 10% between 96(0x60) and 15(0x0F), only needed for hover
      const initial_colour_75 = item.colour + '23'; // 75% between 96(0x60) and 15(0x0F), only needed for hover
      const initial_colour_100 = item.colour + '0F';
      const hover_colour_0 = item.colour + '66';
      const hover_colour_10 = item.colour + '33';
      const hover_colour_75 = item.colour + '00';
      const hover_colour_100 = item.colour + '00'; // only needed for initial
      try {
        window.CSS.registerProperty({
          name: gradient_var_0,
          syntax: '<color>',
          initialValue: initial_colour_0,
          inherits: false,
        });
        window.CSS.registerProperty({
          name: gradient_var_10,
          syntax: '<color>',
          initialValue: initial_colour_10,
          inherits: false,
        });
        window.CSS.registerProperty({
          name: gradient_var_75,
          syntax: '<color>',
          initialValue: initial_colour_75,
          inherits: false,
        });
        window.CSS.registerProperty({
          name: gradient_var_100,
          syntax: '<color>',
          initialValue: initial_colour_100,
          inherits: false,
        });
      } catch (error) {
        // don't throw on rerenders (names can only be registered once before refresh)
      }
      return (
        <div
          // transition(-all)
          className={`item hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:transform-none`}
          onClick={SelectItem}
          key={item.name}
          style={{
            // on Firefox (which doesn't support @property yet) these would not be set yet
            [gradient_var_0]: initial_colour_0,
            [gradient_var_10]: initial_colour_10,
            [gradient_var_75]: initial_colour_75,
            [gradient_var_100]: initial_colour_100,
            transition: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1), ${gradient_var_0} 300ms ease-in-out, ${gradient_var_10} 300ms ease-in-out, ${gradient_var_100} 300ms ease-in-out`,
            backgroundImage: `radial-gradient(circle at center 25%, var(${gradient_var_0}) 0%, var(${gradient_var_10}) 10%, var(${gradient_var_75}) 75%, var(${gradient_var_100}) 100%)`,
          }}
          onMouseEnter={({ target }) => {
            target.style.setProperty(gradient_var_0, hover_colour_0);
            target.style.setProperty(gradient_var_10, hover_colour_10);
            target.style.setProperty(gradient_var_75, hover_colour_75);
            target.style.setProperty(gradient_var_100, hover_colour_100);
          }}
          onMouseLeave={({ target }) => {
            target.style.setProperty(gradient_var_0, initial_colour_0);
            target.style.setProperty(gradient_var_10, initial_colour_10);
            target.style.setProperty(gradient_var_75, initial_colour_75);
            target.style.setProperty(gradient_var_100, initial_colour_100);
          }}
        >
          <img
            className="item-icon"
            alt="icon"
            draggable={false}
            src={item.icon_url}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderIcon;
            }}
          />
          <div className="absolute top-3 right-3">{isItemInstalled(item.name) && <MdCheckCircle style={{ color: `${item.colour}` }} className="h-8 w-8" />}</div>
          <div className="card-details">
            <span className="card-title">{item.display_name || item.name}</span>
            {!isCurator ? (
              <span className="card-subtitle">
                {variables.getMessage('marketplace:by', { author: item.author })}
              </span>
            ) : (
              ''
            )}

            {type === true && !onCollection ? (
              <span className="card-type">
                {variables.getMessage('marketplace:' + getName(item.type))}
              </span>
            ) : null}
          </div>
        </div>
      );
  }
}

export { ItemCard as default, ItemCard };
