import { PureComponent } from 'react';
import { ErrorOutline } from '@material-ui/icons';

export default class ErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
    this.language = window.language.modals.main.error_boundary;
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    window.stats.postEvent('modal', 'Error occurred');
    return { 
      error: true 
    };
  }

  render() {
    if (this.state.error) {
      return (
        <div className='emptyitems'>
          <div className='emptyMessage'>
            <ErrorOutline/>
            <h1>{this.language.title}</h1>
            <p>{this.language.message}</p>
            <button className='refresh' onClick={() => window.location.reload()}>{this.language.refresh}</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
