import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = login(email.trim(), password);
    setLoading(false);
    if (r.ok) {
      if (localStorage.getItem("vibemood_onboarded") === "1") navigate("/", { replace: true });
      else navigate("/onboard", { replace: true });
    } else setError(r.error || "Error");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8">
        <div className="glass-inner space-y-5">
          <div className="flex justify-center"><Logo size={40} showWordmark /></div>
          <h1 className="font-display text-2xl font-bold text-center">Welcome back</h1>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <div>
              <label className="text-xs text-muted">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 h-11 px-3 rounded-xl bg-surface/40 text-text focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <button type="button" aria-label="Toggle password" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {show ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-secondary">{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-60">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div className="flex items-center gap-3 text-xs text-muted"><div className="flex-1 h-px bg-white/10" />or<div className="flex-1 h-px bg-white/10" /></div>
          <div className="flex justify-center gap-3">
            {["G","A","P"].map((l) => (
              <button key={l} aria-label={l === "G" ? "Google" : l === "A" ? "Apple" : "Phone"} className="w-11 h-11 rounded-full glass flex items-center justify-center">{l}</button>
            ))}
          </div>
          <p className="text-center text-sm text-muted">
            New here? <Link to="/signup" className="text-primary font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs text-muted">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 h-11 px-3 rounded-xl bg-surface/40 text-text focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
