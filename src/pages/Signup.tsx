import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import { Eye, EyeOff } from "lucide-react";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const st = strength(password);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!terms) { setError("Please accept the terms."); return; }
    const r = signup(name.trim(), email.trim(), password);
    if (r.ok) navigate("/onboard", { replace: true });
    else setError(r.error || "Error");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8">
        <div className="glass-inner space-y-4">
          <div className="flex justify-center"><Logo size={40} showWordmark /></div>
          <h1 className="font-display text-2xl font-bold text-center">Create account</h1>
          <form onSubmit={submit} className="space-y-3">
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <div>
              <label className="text-xs text-muted">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 h-11 px-3 rounded-xl bg-surface/40 text-text focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <button type="button" aria-label="Toggle password" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {show ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
                </button>
              </div>
              <div className="flex gap-1 mt-2">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i < st ? "var(--primary)" : "var(--surface)" }} />
                ))}
              </div>
            </div>
            <Field label="Confirm password" type="password" value={confirm} onChange={setConfirm} />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              I agree to the terms
            </label>
            {error && <p className="text-sm text-secondary">{error}</p>}
            <button type="submit" className="w-full h-11 rounded-xl bg-primary text-white font-semibold">Create account</button>
          </form>
          <p className="text-center text-sm text-muted">
            Already have an account? <Link to="/login" className="text-primary font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange }: any) {
  return (
    <div>
      <label className="text-xs text-muted">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 h-11 px-3 rounded-xl bg-surface/40 text-text focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </div>
  );
}
