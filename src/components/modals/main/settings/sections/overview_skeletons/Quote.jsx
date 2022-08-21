import { MdPerson } from 'react-icons/md';

export default function QuoteSkeleton() {
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
