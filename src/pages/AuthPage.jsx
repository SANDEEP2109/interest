import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "username") val = val.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setForm((p) => ({ ...p, [e.target.name]: val }));
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields.");
    if (mode === "signup" && !form.name) return setError("Please enter your name.");
    if (mode === "signup" && form.username.length < 3) return setError("Username must be at least 3 characters.");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        navigate("/dashboard");
      } else {
        await signup(form.email, form.password, form.name, form.username);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(friendlyError(err.message || err.code));
    }
    setLoading(false);
  };

  const friendlyError = (code) => {
    if (code === "username-taken") return "That username is already taken.";
    if (code?.includes("user-not-found")) return "No account found with this email.";
    if (code?.includes("wrong-password") || code?.includes("invalid-credential")) return "Incorrect email or password.";
    if (code?.includes("email-already-in-use")) return "Email already registered.";
    if (code?.includes("weak-password")) return "Password should be at least 6 characters.";
    if (code?.includes("invalid-email")) return "Invalid email address.";
    return "Something went wrong. Please try again.";
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-top">
          <span className="wordmark">wishlist</span>
          <p className="auth-tagline">your aesthetic collection, shared.</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}>
            sign in
          </button>
          <button className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => { setMode("signup"); setError(""); }}>
            create account
          </button>
        </div>

        <div className="auth-form">
          {mode === "signup" && (
            <>
              <div className="form-group">
                <label className="form-label">your name</label>
                <input className="form-input" name="name" placeholder="Sandeep Vemuri"
                  value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">username</label>
                <div className="input-prefix-wrap">
                  <span className="input-prefix">wishlist.app/profile/</span>
                  <input className="form-input prefix-input" name="username"
                    placeholder="sandeep" value={form.username} onChange={handleChange} />
                </div>
                <p className="form-hint">only lowercase letters, numbers, underscores</p>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">email</label>
            <input className="form-input" name="email" type="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">password</label>
            <input className="form-input" name="password" type="password"
              placeholder="••••••••" value={form.password} onChange={handleChange} />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "please wait..." : mode === "login" ? "sign in" : "create account"}
          </button>
        </div>
      </div>
    </div>
  );
}
