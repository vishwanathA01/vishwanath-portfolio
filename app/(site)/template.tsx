import { ViewTransition } from "react";

/**
 * A template re-mounts on every navigation (unlike a layout), so each page "enters" and the
 * previous one "exits" — React turns that into a View Transition. Browsers without support
 * simply swap pages instantly. Named elements inside (project screenshots) morph between pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="page">{children}</div>
    </ViewTransition>
  );
}
