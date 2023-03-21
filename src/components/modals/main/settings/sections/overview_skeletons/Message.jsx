import { memo } from 'preact/compat';

function MessageSkeleton() {
  return (
    <h2 className="message">
      <span>
        Message
        <br />
      </span>
    </h2>
  );
}

export default memo(MessageSkeleton);
