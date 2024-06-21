import variables from 'config/variables';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { ItemCard } from 'features/marketplace/components/Elements';

const NewItems = ({ items, view }) => {
  const { setSubTab } = useTab();

  switch (view) {
    case 'list':
      return (
        <table className="w-full">
          <thead className="text-left">
             <tr>
              <th>Name</th>
              <th>Type</th>
              {/*<th>{variables.getMessage('settings:sections.quote.author')}</th>*/}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <ItemCard
                item={item}
                type={true}
                key={index}
                cardStyle="list"
              />
            ))}
          </tbody>
        </table>
      );
    default:
      return (
        <div className="items">
          {items.map((item, index) => (
            <ItemCard
              item={item}
              type={true}
              key={index}
              cardStyle="card"
            />
          ))}
        </div>
      );
  }
};

export { NewItems };
