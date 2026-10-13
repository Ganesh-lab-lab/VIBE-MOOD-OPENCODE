import React from "react";

export const Logo: React.FC<{ size?: number; showWordmark?: boolean }> = ({ size = 32, showWordmark = false }) => {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="12" fill="var(--primary)" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="var(--primary)" strokeWidth="1.5" opacity="0.5" />
        <circle cx="32" cy="32" r="30" fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.25" />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-tight lowercase" style={{ color: "var(--text)" }}>
          vibemood
        </span>
      )}
    </div>
  );
};
