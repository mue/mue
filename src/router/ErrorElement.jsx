import { useRouteError } from 'react-router';
import { captureException } from '@sentry/react';
import variables from 'config/variables';
import { useState } from 'react';

/**
 * Error element for React Router error boundaries
 * Displays when a route throws an error or fails to load
 */
export default function ErrorElement() {
  const error = useRouteError();
  const [showReport, setShowReport] = useState(true);

  console.error('Route error:', error);

  const reportError = () => {
    captureException(error);
    setShowReport(false);
  };

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
        {error?.message && (
          <details style={{ marginTop: '1rem', opacity: 0.7 }}>
            <summary>Error Details</summary>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>{error.message}</pre>
          </details>
        )}
        <div className="criticalError-actions">
          {showReport ? (
            <button onClick={reportError}>{reportButton}</button>
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
