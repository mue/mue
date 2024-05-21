import { memo } from 'react';

function WeatherSkeleton({ weatherType }) {
  return (
    <div className="weather skeleton">
      <div className="weatherCore">
        <div className="iconAndTemps">
          <div className="weathericon">
            <div className="mainSkeletonIcon pulse"></div>
            <span className="pulse">20C</span>
          </div>
          {weatherType >= 2 && (
            <span className="minmax">
              <span className="subtitle pulse">min</span>
              <span className="subtitle pulse">max</span>
            </span>
          )}
        </div>
        {weatherType >= 2 && (
          <div className="extra-info">
            <span className="pulse">feels like x</span>
            <span className="loc pulse">location</span>
          </div>
        )}
      </div>
      {weatherType >= 3 && (
        <div className="weatherExpandedInfo">
          <span className="subtitle pulse">extra information</span>
          <div className="weatherExpandedInfoItems">
            <div className="infoItemSkeleton">
              <div className="smallSkeletonIcon pulse"></div>
              <span className="loc pulse">location</span>
            </div>
            <div className="infoItemSkeleton">
              <div className="smallSkeletonIcon pulse"></div>
              <span className="loc pulse">location</span>
            </div>
            <div className="infoItemSkeleton">
              <div className="smallSkeletonIcon pulse"></div>
              <span className="loc pulse">location</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(WeatherSkeleton);
