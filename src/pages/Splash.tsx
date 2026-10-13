import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";

export function Splash() {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  useEffect(() => {
    const t = setTimeout(() => {
      if (loggedIn) {
        if (localStorage.getItem("vibemood_onboarded") === "1") navigate("/", { replace: true });
        else navigate("/onboard", { replace: true });
      } else navigate("/login", { replace: true });
    }, 1500);
    return () => clearTimeout(t);
  }, [loggedIn, navigate]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4">
      <div className="absolute inset-0 -z-10" />
      <div className="w-40 h-40 rounded-full bg-primary/20 blur-3xl absolute" />
      <Logo size={64} showWordmark />
      <p className="text-muted">Music that moves with your day.</p>
    </div>
  );
}
