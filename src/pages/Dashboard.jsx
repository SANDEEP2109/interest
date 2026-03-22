import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection, addDoc, deleteDoc, doc, updateDoc,
  onSnapshot, query, orderBy, getDoc, setDoc,
} from "firebase/firestore";
import Header from "../components/Header";
import Profile from "../components/Profile";
import WishlistSection from "../components/WishlistSection";
import AddItemModal from "../components/AddItemModal";

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("owner");

  // Load user profile
  // Load user profile - create if doesn't exist
useEffect(() => {
  if (!user) return;
  const ref = doc(db, "users", user.uid);
  getDoc(ref).then((snap) => {
    if (snap.exists()) {
      setProfile(snap.data());
    } else {
      // Auto-create profile from Firebase auth user
      const newProfile = {
        name: user.displayName || user.email.split("@")[0],
        username: user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
        email: user.email,
        bio: "my personal wishlist — things i love & things i have.",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=2e2e2b&color=e8e2d5&size=200`,
      };
      setDoc(ref, newProfile).then(() => setProfile(newProfile));
    }
  });
}, [user]);

  // Real-time wishlist items
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "items"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const addItem = async (item) => {
    await addDoc(collection(db, "users", user.uid, "items"), {
      ...item,
      createdAt: new Date(),
    });
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "items", id));
  };

  const moveToHave = async (id) => {
    await updateDoc(doc(db, "users", user.uid, "items", id), { section: "have" });
  };

  const wantItems = items.filter((i) => i.section === "want");
  const haveItems = items.filter((i) => i.section === "have");

  return (
    <div className="app-root">
      <Header
        view={view}
        setView={setView}
        onAdd={() => setIsModalOpen(true)}
        profile={profile}
      />
      <main className="main-content">
        <Profile profile={profile} isOwner={true} />
        <div className="sections-wrapper">
          <WishlistSection
            title="The Vision" subtitle="dreaming of"
            items={wantItems} section="want"
            isOwner={view === "owner"}
            onDelete={deleteItem} onMove={moveToHave}
          />
          <WishlistSection
            title="The Reality" subtitle="already mine"
            items={haveItems} section="have"
            isOwner={view === "owner"}
            onDelete={deleteItem} onMove={null} showFilter={false}
          />
        </div>
      </main>
      {isModalOpen && (
        <AddItemModal onAdd={addItem} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
