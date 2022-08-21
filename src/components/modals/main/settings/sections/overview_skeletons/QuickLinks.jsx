import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { SiKofi, SiPatreon } from 'react-icons/si';

export default function QuicklinksSkeleton() {
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
          <SiKofi />
        </div>
        <div>
          <SiPatreon />
        </div>
      </div>
    </div>
  );
}
