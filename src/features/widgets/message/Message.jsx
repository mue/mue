import { useState, useEffect, useRef } from 'react';
import EventBus from 'utils/eventbus';
import './message.scss';

const Message = () => {
  const [messageText, setMessageText] = useState('');
  const [display, setDisplay] = useState('none');
  const [fontSize, setFontSize] = useState('1em');
  const message = useRef();

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'message') {
        const messageSetting = localStorage.getItem('message');
        const zoomMessage = localStorage.getItem('zoomMessage');
        setDisplay(messageSetting === 'false' ? 'none' : 'block');
        setFontSize(`${1 * Number((zoomMessage || 100) / 100)}em`);
      }
    };

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    if (messages.length > 0) {
      setMessageText(messages[Math.floor(Math.random() * messages.length)]);
      setDisplay('block');
    }

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh');
    };
  }, []);

  return (
    <h2 className="message" ref={message} style={{ display, fontSize }}>
      {messageText.split('\\n').map((item) => (
        <span key={item}>
          {item}
          <br />
        </span>
      ))}
    </h2>
  );
};

export default Message;
