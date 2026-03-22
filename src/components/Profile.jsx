export default function Profile({ profile, isOwner }) {
  if (!profile) return null;

  return (
    <section className="profile-section">
      <div className="profile-avatar-wrap">
        <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
      </div>
      <div className="profile-info">
        <h1 className="profile-name">{profile.name}</h1>
        <p className="profile-handle">@{profile.username}</p>
        <p className="profile-bio">{profile.bio}</p>
      </div>
    </section>
  );
}
