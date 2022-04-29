import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { captureException } from '@sentry/react';

export default class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorData: '',
      showReport: true,
    };
  }

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
              {variables.language.getMessage(
                variables.languagecode,
                'modals.main.error_boundary.title',
              )}
            </span>
            <span className="subtitle">
              {variables.language.getMessage(
                variables.languagecode,
                'modals.main.error_boundary.message',
              )}
            </span>
            <div className="buttonsRow">
              {this.state.showReport ? (
                <button onClick={() => this.reportError()}>Send Error Report</button>
              ) : (
                <span className="subtitle">Sent!</span>
              )}
              <button className="refresh" onClick={() => window.location.reload()}>
                {variables.language.getMessage(
                  variables.languagecode,
                  'modals.main.error_boundary.refresh',
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
