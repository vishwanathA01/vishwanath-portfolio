import { ViewTransition } from "react";

/** Wraps a project screenshot so it morphs between the list/card and the case-study hero. */
export default function Shot({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={`shot-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
