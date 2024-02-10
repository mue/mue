import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Mue has broken horribly</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
