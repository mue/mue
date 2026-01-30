// Importing necessary libraries and components
import { Wrapper, Panel } from './components/Layout';
import { SimpleWelcome } from './components/Sections';

import './welcome.scss';

// WelcomeModal component
function WelcomeModal({ modalClose, modalSkip }) {
  // Render the simplified welcome component
  return (
    <Wrapper>
      <Panel type="content" className="simpleWelcome">
        <SimpleWelcome modalClose={modalClose} modalSkip={modalSkip} />
      </Panel>
    </Wrapper>
  );
}

// Export the WelcomeModal component
export default WelcomeModal;
