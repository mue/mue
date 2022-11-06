import { memo } from 'react';

function DateSkeleton() {
  return <span className="date">Thursday January 1st</span>;
}

export default memo(DateSkeleton);
