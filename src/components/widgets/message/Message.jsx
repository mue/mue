import { PureComponent, createRef } from 'react';

import EventBus from 'modules/helpers/eventbus';

import './message.scss';

export default class Message extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
    };
    this.message = createRef();
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'message') {
        if (localStorage.getItem('message') === 'false') {
          return (this.message.current.style.display = 'none');
        }

        this.message.current.style.display = 'block';
        this.message.current.style.fontSize = `${
          1 * Number((localStorage.getItem('zoomMessage') || 100) / 100)
        }em`;
      }
    });

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    if (messages.length === 0) {
      return (this.message.current.style.display = 'none');
    }

    this.message.current.style.fontSize = `${
      1 * Number((localStorage.getItem('zoomMessage') || 100) / 100)
    }em`;

    this.setState({
      messageText: messages[Math.floor(Math.random() * messages.length)],
    });
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    return (
      <h2 className="message" ref={this.message}>
        {this.state.messageText.split('\\n').map((item, i) => (
          <span key={i}>
            {item}
            <br />
          </span>
        ))}
      </h2>
    );
  }
}
