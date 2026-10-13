import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function greetingHour(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveHour } = useTheme();
  const topLang = user?.languages?.[0] || "en";
  const greetLine = topLang === "te" ? "నమస్కారం" : topLang === "hi" ? "नमस्ते" : topLang === "ta" ? "வணக்கம்" : topLang === "ml" ? "നമസ്കാരം" : topLang === "kn" ? "ನಮಸ್ಕಾರ" : "";
  useEffect(() => {
    localStorage.setItem("vibemood_onboarded", "1");
    const t = setTimeout(() => navigate("/", { replace: true }), 2500);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-muted text-lg mb-2">{greetingHour(effectiveHour)},</div>
        <h1 className="font-display text-6xl font-extrabold tracking-tight">Hello, {user?.name || "there"}</h1>
        {greetLine && <div className="text-2xl mt-2" style={{ lineHeight: 1.5 }}>{greetLine}</div>}
        <p className="text-muted mt-4">Setting up your vibe...</p>
      </div>
    </div>
  );
}
