import variables from 'config/variables';

const PresetsTab = ({ settings, count, onIncrementCount }) => {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>{variables.getMessage('modals.main.marketplace.product.setting')}</th>
            <th>{variables.getMessage('modals.main.marketplace.product.value')}</th>
          </tr>
          {Object.entries(settings)
            .slice(0, count)
            .map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="showMoreItems">
        <span className="link" onClick={() => onIncrementCount('settings')}>
          {count !== Object.keys(settings).length
            ? variables.getMessage('modals.main.marketplace.product.show_all')
            : variables.getMessage('modals.main.marketplace.product.show_less')}
        </span>
      </div>
    </>
  );
};

export default PresetsTab;
