import variables from 'config/variables';
import { MdOutlineWarning } from 'react-icons/md';

const WarningBanner = ({ data, shortLocale }) => {
  const template = (message) => (
    <div className="itemWarning">
      <MdOutlineWarning />
      <div className="text">
        <span className="header">Warning</span>
        <span>{message}</span>
      </div>
    </div>
  );

  if (data.sideload === true) {
    return template(variables.getMessage('modals.main.marketplace.product.sideload_warning'));
  }

  if (data.image_api === true) {
    return template(variables.getMessage('modals.main.marketplace.product.third_party_api'));
  }

  if (data.language !== undefined && data.language !== null) {
    if (shortLocale !== data.language) {
      return template(variables.getMessage('modals.main.marketplace.product.not_in_language'));
    }
  }

  return null;
};

export default WarningBanner;
