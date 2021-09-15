import { PureComponent, createRef } from 'react';

import EventBus from 'modules/helpers/eventbus';

import './message.scss';

export default class Message extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messageText: localStorage.getItem('messageText')
    };
    this.message = createRef();
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'message') {
        if (localStorage.getItem('message') === 'false') {
          return this.message.current.style.display = 'none';
        }

        this.message.current.style.display = 'block';
        this.message.current.style.fontSize = `${1.6 * Number((localStorage.getItem('zoomMessage') || 100) / 100)}em`;

        this.setState({
          messageText: localStorage.getItem('messageText')
        });
      }
    });

    this.message.current.style.fontSize = `${1.6 * Number((localStorage.getItem('zoomMessage') || 100) / 100)}em`;
  }

  render() {
    return (
      <h2 className='message' ref={this.message}>
        {localStorage.getItem('messageText')}
      </h2>
    );
  }
}
