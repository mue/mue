import { memo } from 'react';

function GreetingSkeleton() {
  return <span className="greeting">Good Morning</span>;
}

export default memo(GreetingSkeleton);
