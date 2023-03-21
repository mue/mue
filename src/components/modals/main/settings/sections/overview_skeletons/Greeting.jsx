import { memo } from 'preact/compat';

function GreetingSkeleton() {
  return <span className="greeting">Good Morning</span>;
}

export default memo(GreetingSkeleton);
