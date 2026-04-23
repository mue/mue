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
      const title = variables.getMessage
        ? variables.getMessage('error_boundary.title')
        : 'An error occurred';
      const message = variables.getMessage
        ? variables.getMessage('error_boundary.message')
        : 'Something went wrong. Please try refreshing the page.';
      const reportButton = variables.getMessage
        ? variables.getMessage('error_boundary.report_button')
        : 'Report Error';
      const sentSuccessfully = variables.getMessage
        ? variables.getMessage('error_boundary.sent_successfully')
        : 'Report sent successfully';
      const supportDiscord = variables.getMessage
        ? variables.getMessage('error_boundary.support_discord')
        : 'Get Support on Discord';

      return (
        <div className="criticalError">
          <div className="criticalError-message">
            <h1>{title}</h1>
            <p>{message}</p>
            <div className="criticalError-actions">
              {this.state.showReport ? (
                <button onClick={() => this.reportError()}>{reportButton}</button>
              ) : (
                <p>{sentSuccessfully}</p>
              )}
              <a href="https://discord.gg/zv8C9F8" target="_blank" rel="noreferrer">
                {supportDiscord}
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
