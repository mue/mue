import { MdPerson } from 'react-icons/md';

export default function QuoteSkeleton() {
  return (
    <div className="quoteSkeleton">
      <span className="subtitle">"Cheese good"</span>
        <div className="skeletonAuthor">
          <div>
            <MdPerson />
          </div>
          <div className="text">
            <span className="title">James May</span>
            <span className="subtitle">Cheese Man</span>
          </div>
        </div>
    </div>
  );
}
