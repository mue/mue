import React, { PureComponent } from 'react';

import { captureException } from '@sentry/react';
import variables from 'config/variables';

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
            <h1>{variables.getMessage('error_boundary.title')}</h1>
            <p>{variables.getMessage('error_boundary.message')}</p>
            <div className="criticalError-actions">
              {this.state.showReport ? (
                <button onClick={() => this.reportError()}>
                  {variables.getMessage('error_boundary.report_button')}
                </button>
              ) : (
                <p>{variables.getMessage('error_boundary.sent_successfully')}</p>
              )}
              <a href="https://discord.gg/zv8C9F8" target="_blank" rel="noreferrer">
                {variables.getMessage('error_boundary.support_discord')}
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
