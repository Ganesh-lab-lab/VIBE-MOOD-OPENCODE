import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import SkyBackdrop from "../components/SkyBackdrop";

export default function AppLayout() {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [onboarded] = useState(() => localStorage.getItem("vibemood_onboarded") === "1");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    if (!loggedIn) navigate("/splash", { replace: true });
    else if (!onboarded && loc.pathname !== "/onboard") navigate("/onboard", { replace: true });
  }, [loggedIn, onboarded, loc.pathname, navigate]);

  if (!loggedIn) return null;

  const Layout = isDesktop ? DesktopLayout : MobileLayout;
  return (
    <div className="min-h-screen relative">
      <SkyBackdrop />
      <Layout />
    </div>
  );
}
