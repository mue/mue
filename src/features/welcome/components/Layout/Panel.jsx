import { motion, AnimatePresence } from 'framer-motion';

const Panel = ({ children, type }) => {
  let className;
  switch (type) {
    case 'aside':
      className = 'aside';
      break;
    case 'content':
      return <section className="content">{children}</section>;
    default:
      className = type;
  }
  return <section className={className}>{children}</section>;
};

export { Panel as default, Panel };
