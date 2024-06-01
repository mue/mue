import { memo } from 'react';

function GreetingSkeleton() {
  return <span className="greeting preview">Good Morning</span>;
}

export default memo(GreetingSkeleton);
