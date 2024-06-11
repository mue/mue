import { useState, useEffect, useRef } from 'react';
import EventBus from 'utils/eventbus';
import defaults from './options/default';
import './message.scss';

const Message = () => {
  const calculateFontSize = () => {
    const zoomMessage = localStorage.getItem('zoomMessage') || defaults.zoomMessage;
    return `${1 * Number((zoomMessage || 100) / 100)}em`;
  };

  const [messageText, setMessageText] = useState('');
  const [display, setDisplay] = useState('none');
  const [fontSize, setFontSize] = useState(calculateFontSize());
  const message = useRef();

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'message') {
        const messageSetting = localStorage.getItem('message');
        setDisplay(messageSetting === 'false' ? 'none' : 'block');
        setFontSize(calculateFontSize());
      }
    };

    const messages = JSON.parse(localStorage.getItem('messages')) || defaults.messages;
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

export { Message as default, Message };
