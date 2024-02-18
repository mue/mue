import { memo } from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { SiGithubsponsors, SiOpencollective } from 'react-icons/si';

function QuicklinksSkeleton() {
  return (
    <div className="quickLinksSkeleton">
      <div className="circles">
        <div>
          <FaDiscord />
        </div>
        <div>
          <FaTwitter />
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
