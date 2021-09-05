export default function SideloadFailedModal({ modalClose, reason }) {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Error</h1>
      <span>Failed to sideload addon</span>
      <br/><br/>
      <span>{reason}</span>
      <div className='resetfooter'>
        <button className='import' onClick={modalClose}>Close</button>
      </div>
    </>
  );
}
