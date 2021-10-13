import './preview.scss';

export default function Preview(props) {
  return (
    <div className='preview'>
      <h3>NOTICE</h3>
      <h1>You are currently in preview mode. Settings will be reset on closing this tab.</h1>
      <button className='uploadbg' onClick={() => props.setup()}>Continue Setup</button>
    </div>
  );
}
