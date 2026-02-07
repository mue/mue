import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './index';

/**
 * ModalRouter - Wraps modal content with React Router
 *
 * This component integrates React Router v7 with the existing modal system.
 * It provides hash-based routing within the modal while maintaining
 * compatibility with the existing modal open/close logic.
 *
 * During the transition:
 * - The modal open/close state remains managed by Modals.jsx
 * - The router controls what content is shown when modal is open
 * - Deep linking continues to work via hash URLs
 */
export function ModalRouter({ children, fallback }) {
  return (
    <Suspense fallback={fallback || <div id="loader"></div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
