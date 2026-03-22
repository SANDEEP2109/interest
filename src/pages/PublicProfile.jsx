import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection, query, orderBy, getDocs,
  where, limit, getDoc, doc
} from "firebase/firestore";
import WishlistSection from "../components/WishlistSection";
import Profile from "../components/Profile";

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Look up uid from username
        const unameDoc = await getDoc(doc(db, "usernames", username));
        if (!unameDoc.exists()) return setNotFound(true);

        const uid = unameDoc.data().uid;

        // Get profile
        const profileDoc = await getDoc(doc(db, "users", uid));
        if (!profileDoc.exists()) return setNotFound(true);
        setProfile(profileDoc.data());

        // Get items
        const q = query(
          collection(db, "users", uid, "items"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  if (loading) return (
    <div className="loading-screen">
      <span className="wordmark">wishlist</span>
    </div>
  );

  if (notFound) return (
    <div className="notfound-screen">
      <span className="wordmark">wishlist</span>
      <p>this profile doesn't exist.</p>
      <Link to="/" className="back-link">go back</Link>
    </div>
  );

  const wantItems = items.filter((i) => i.section === "want");
  const haveItems = items.filter((i) => i.section === "have");

  return (
    <div className="app-root">
      {/* Minimal public header */}
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="wordmark">wishlist</Link>
          <Link to="/auth" className="add-btn">join wishlist</Link>
        </div>
      </header>

      <main className="main-content">
        <Profile profile={profile} isOwner={false} />
        <div className="sections-wrapper">
          <WishlistSection
            title="What I Want" subtitle="dreaming of"
            items={wantItems} section="want"
            isOwner={false}
            onDelete={null} onMove={null}
          />
          <WishlistSection
            title="What I Have" subtitle="already mine"
            items={haveItems} section="have"
            isOwner={false}
            onDelete={null} onMove={null}
          />
        </div>
      </main>
    </div>
  );
}
