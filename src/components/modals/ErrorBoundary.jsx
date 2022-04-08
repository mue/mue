import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdErrorOutline } from 'react-icons/md';

export default class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    variables.stats.postEvent('modal', 'Error occurred');
    return {
      error: true,
    };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="emptyItems">
          <div className="emptyMessage">
            <MdErrorOutline />
            <h1>
              {variables.language.getMessage(
                variables.languagecode,
                'modals.main.error_boundary.title',
              )}
            </h1>
            <p>
              {variables.language.getMessage(
                variables.languagecode,
                'modals.main.error_boundary.message',
              )}
            </p>
            <button className="refresh" onClick={() => window.location.reload()}>
              {variables.language.getMessage(
                variables.languagecode,
                'modals.main.error_boundary.refresh',
              )}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
