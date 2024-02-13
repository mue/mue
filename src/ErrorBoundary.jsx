import React, { PureComponent } from 'react';

import { captureException } from '@sentry/react';

class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorData: '',
      showReport: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error: true, errorData: errorInfo });
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  reportError() {
    captureException(this.state.errorData);
    this.setState({
      showReport: false,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="criticalError">
          <div className="criticalError-message">
            <h1>A critical error has occurred</h1>
            <p>
              The new tab page could not be loaded. Please uninstall the extension and try again.
            </p>
            <div className="criticalError-actions">
              {this.state.showReport ? (
                <button onClick={() => this.reportError()}>Report Issue</button>
              ) : (
                <p>Sent Successfully</p>
              )}
              <a href="https://discord.gg/zv8C9F8" target="_blank" rel="noreferrer">
                Support Discord
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
