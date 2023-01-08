import { memo } from 'react';
import { MdPerson } from 'react-icons/md';

function QuoteSkeleton() {
  return (
    <div className="quoteSkeleton">
      <span className="subtitle">"Never gonna give you up"</span>
      <div className="skeletonAuthor">
        <div>
          <MdPerson />
        </div>
        <div className="text">
          <span className="title">Rick Astley</span>
          <span className="subtitle">English singer-songwriter</span>
        </div>
      </div>
    </div>
  );
}

export default memo(QuoteSkeleton);
