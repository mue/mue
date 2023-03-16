import variables from 'modules/variables';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdErrorOutline } from 'react-icons/md';
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

  /**
   * If an error occurs, log the error, and set the state to error: true, and errorData: error.
   * @param {Error} error The error that occurred.
   * @returns An object with two properties: error and errorData.
   */
  static getDerivedStateFromError(error) {
    console.log(error);
    variables.stats.postEvent('modal', 'Error occurred');
    return {
      error: true,
      errorData: error,
    };
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
        <div className="emptyItems">
          <div className="emptyNewMessage">
            <MdErrorOutline />
            <span className="title">
              {variables.getMessage('modals.main.error_boundary.title')}
            </span>
            <span className="subtitle">
              {variables.getMessage('modals.main.error_boundary.message')}
            </span>
            <div className="buttonsRow">
              {this.state.showReport ? (
                <button onClick={() => this.reportError()}>
                  {variables.getMessage('modals.main.error_boundary.report_error')}
                </button>
              ) : (
                <span className="subtitle">
                  {variables.getMessage('modals.main.error_boundary.sent')}
                </span>
              )}
              <button className="refresh" onClick={() => window.location.reload()}>
                {variables.getMessage('modals.main.error_boundary.refresh')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
