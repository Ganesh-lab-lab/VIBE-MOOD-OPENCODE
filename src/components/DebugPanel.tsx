import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function DebugPanel() {
  const t = useTheme();
  if (!t.debugOpen) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 glass p-4 w-72">
      <div className="glass-inner space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold">Debug hours</span>
          <button aria-label="Close debug" className="text-muted" onClick={() => t.setDebugOpen(false)}>✕</button>
        </div>
        <input
          type="range" min={0} max={23} value={t.forcedHour ?? t.effectiveHour}
          onChange={(e) => t.setForcedHour(Number(e.target.value))}
          className="w-full"
          aria-label="Force hour"
        />
        <div className="flex items-center justify-between text-sm">
          <span>Hour: {t.forcedHour ?? "auto"}</span>
          <button className="px-2 py-1 rounded bg-primary text-white text-xs" onClick={() => t.setForcedHour(null)}>Auto time</button>
        </div>
        <div className="text-xs text-muted">Bucket: {t.bucket}</div>
      </div>
    </div>
  );
}
