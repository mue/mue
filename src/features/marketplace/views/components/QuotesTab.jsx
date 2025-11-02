import variables from 'config/variables';

const QuotesTab = ({ quotes, count, onIncrementCount }) => {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>{variables.getMessage('modals.main.settings.sections.quote.title')}</th>
            <th>{variables.getMessage('modals.main.settings.sections.quote.author')}</th>
          </tr>
          {quotes.slice(0, count).map((quote, index) => (
            <tr key={index}>
              <td>{quote.quote}</td>
              <td>{quote.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="showMoreItems">
        <span className="link" onClick={() => onIncrementCount('quotes')}>
          {count !== quotes.length
            ? variables.getMessage('modals.main.marketplace.product.show_all')
            : variables.getMessage('modals.main.marketplace.product.show_less')}
        </span>
      </div>
    </>
  );
};

export default QuotesTab;
