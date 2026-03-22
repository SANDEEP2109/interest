import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ view, setView, onAdd, profile }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const copyProfileLink = () => {
    const url = `${window.location.origin}/profile/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <span className="wordmark">interest</span>
        <div className="header-actions">
          <button className={`view-toggle ${view === "owner" ? "active" : ""}`}
            onClick={() => setView("owner")}>edit</button>
          <span className="divider">·</span>
          <button className={`view-toggle ${view === "public" ? "active" : ""}`}
            onClick={() => setView("public")}>preview</button>

          {profile?.username && (
            <button className="share-btn" onClick={copyProfileLink}>
              {copied ? "✓ copied!" : "share profile"}
            </button>
          )}

          {view === "owner" && (
            <button className="add-btn" onClick={onAdd}>+ add item</button>
          )}

          <button className="logout-btn" onClick={handleLogout}>sign out</button>
        </div>
      </div>
    </header>
  );
}
