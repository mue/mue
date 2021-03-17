import React from 'react';

export default class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return { error: true };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{'text-align': 'center'}}>
          <h1>Error</h1>
          <p>Failed to load this component of Mue.</p>
          <button class='refresh' onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )
    }

    return this.props.children;
  }
}
