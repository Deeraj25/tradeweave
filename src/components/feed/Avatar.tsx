import { profile } from "../../data/profile";

/** The user's avatar — initials in a warm gold ring (stands in for the onboarding photo). */
export default function Avatar({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-ink ring-2 ring-gold/70 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: "linear-gradient(135deg, #e6c566, #d4a537 60%, #b9842a)",
      }}
      aria-label={`${profile.name}, ${profile.season}`}
      title={`${profile.name} · ${profile.season}`}
    >
      {profile.initials}
    </div>
  );
}
