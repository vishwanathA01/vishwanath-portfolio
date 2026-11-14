/** The V monogram: two ribbon strokes, each split by a parallel hairline gap. Traced from the supplied logo. */
export const LOGO_PATH =
  "M0 0H179L419 548L631 66H595L419 467L384 385L553 0H732L445 655H394L136 66H100L359 655H287Z";
export const LOGO_VIEWBOX = "0 0 732 655";

export default function Logo({ size = 28, className, title = "Vishwanath Thakur" }: { size?: number; className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox={LOGO_VIEWBOX}
      width={size}
      height={Math.round((size * 655) / 732)}
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      <path d={LOGO_PATH} />
    </svg>
  );
}

/** Large logo that draws itself stroke-by-stroke, then fills (CSS-driven, respects reduced motion). */
export function LogoDraw({ className }: { className?: string }) {
  return (
    <svg className={`logo-draw ${className || ""}`} viewBox="-12 -12 756 679" aria-hidden="true">
      <path d={LOGO_PATH} pathLength={1} />
    </svg>
  );
}
