import { Link } from "react-router-dom";

export default function Logo({ size = 28, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        className="shrink-0 transition-transform duration-300 group-hover:rotate-12"
        aria-hidden
      >
        {/* woven monogram: two interlaced gold strands */}
        <path d="M4 9 L16 3 L28 9" stroke="#D4A537" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16 L16 10 L28 16" stroke="#E6C566" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        <path d="M4 23 L16 17 L28 23" stroke="#D4A537" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        <path d="M16 3 L16 29" stroke="#F5EFE6" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
      </svg>
      {withText && (
        <span className="text-display text-xl font-semibold tracking-tight text-cream">
          Trade<span className="text-gold">weave</span>
        </span>
      )}
    </Link>
  );
}
