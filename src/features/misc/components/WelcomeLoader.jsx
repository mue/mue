import './WelcomeLoader.scss';

const WelcomeLoader = () => {
  return (
    <div className="welcome-loader">
      <div className="welcome-loader-content">
        <div className="loader-logo shimmer"></div>
        <div className="loader-text-line large shimmer"></div>
        <div className="loader-text-line medium shimmer"></div>
        <div className="loader-button-group">
          <div className="loader-button shimmer"></div>
          <div className="loader-button shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLoader;
