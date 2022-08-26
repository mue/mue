import variables from 'modules/variables';
import { MdClose } from 'react-icons/md';

export default function SideloadFailedModal({ modalClose, reason }) {
  return (
    <>
      <h1>{variables.getMessage('modals.main.error_boundary.title')}</h1>
      <span>{variables.getMessage('modals.main.addons.sideload.failed')}</span>
      <br />
      <br />
      <span>{reason}</span>
      <div className="resetFooter">
        <button className="round import" style={{ marginLeft: '-30px' }} onClick={modalClose}>
          <MdClose />
        </button>
      </div>
    </>
  );
}
