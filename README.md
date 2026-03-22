# wishlist v3 — Public Profiles + Firestore

## Setup Steps

### 1. Enable Firestore in Firebase Console
1. Go to https://console.firebase.google.com → your `wishlist` project
2. Click **Firestore Database** in the left sidebar
3. Click **Create database**
4. Choose **Start in test mode** → Next → Enable

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. How it works
- `/auth` → Login or Signup (pick a unique username)
- `/dashboard` → Your personal wishlist (edit, add, delete)
- `/profile/sandeep` → Public page anyone can visit without login
- Click **"share profile"** in header → copies your profile link

### 4. Firestore Rules (for production)
In Firebase Console → Firestore → Rules, paste this:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      match /items/{itemId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /usernames/{username} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## File Structure
```
src/
├── App.jsx                    ← React Router routes
├── main.jsx
├── index.css
├── firebase.js                ← Firebase + Firestore config
├── context/
│   └── AuthContext.jsx        ← Auth + Firestore user creation
├── pages/
│   ├── AuthPage.jsx           ← Login / Signup with username
│   ├── Dashboard.jsx          ← Owner's private wishlist
│   └── PublicProfile.jsx      ← Public view (no login needed)
└── components/
    ├── Header.jsx             ← Share profile link button
    ├── Profile.jsx
    ├── FilterBar.jsx
    ├── WishlistSection.jsx
    ├── ItemCard.jsx
    └── AddItemModal.jsx
```
