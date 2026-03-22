export default function ItemCard({ item, isOwner, section, onDelete, onMove }) {
  return (
    <div className="item-card">
      <div className="card-image-wrap">
        <img src={item.imageUrl} alt={item.title} className="card-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop";
          }} />
        {item.category && <span className="card-category">{item.category}</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-actions">
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-view">
            view item ↗
          </a>
          {isOwner && (
            <div className="owner-actions">
              {section === "want" && onMove && (
                <button className="btn-move" onClick={() => onMove(item.id)}>✓ got it</button>
              )}
              <button className="btn-delete" onClick={() => onDelete(item.id)}>✕</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
