import React from "react";

export default function SkyBackdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: "var(--bg)" }} />
      <div className="sky-orb orb-anim" style={{ width: 520, height: 520, left: "10%", top: "5%", background: "var(--sky-1)", opacity: 0.35 }} />
      <div className="sky-orb orb-anim-2" style={{ width: 460, height: 460, right: "5%", top: "25%", background: "var(--sky-2)", opacity: 0.3 }} />
      <div className="sky-orb orb-anim-3" style={{ width: 400, height: 400, left: "40%", bottom: "10%", background: "var(--sky-3)", opacity: 0.28 }} />
      <div className="sky-orb orb-anim-4" style={{ width: 360, height: 360, right: "25%", bottom: "5%", background: "var(--sky-4)", opacity: 0.2 }} />
    </div>
  );
}
