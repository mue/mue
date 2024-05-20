import { memo } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { SiGithubsponsors, SiOpencollective, SiX } from 'react-icons/si';

function QuicklinksSkeleton() {
  return (
    <div className="quickLinksSkeleton">
      <div className="circles">
        <div>
          <FaDiscord />
        </div>
        <div>
          <SiX />
        </div>
        <div>
          <SiGithubsponsors />
        </div>
        <div>
          <SiOpencollective />
        </div>
      </div>
    </div>
  );
}

export default memo(QuicklinksSkeleton);
