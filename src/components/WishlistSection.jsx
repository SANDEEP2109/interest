import ItemCard from "./ItemCard";
import FilterBar from "./FilterBar";
import { useState, useMemo } from "react";

export default function WishlistSection({
  title, subtitle, items, section, isOwner, onDelete, onMove, showFilter = true
}) {
  const maxPrice = useMemo(() => {
    const prices = items.map((i) => i.price || 0).filter(Boolean);
    return prices.length ? Math.max(...prices) : 100000;
  }, [items]);

  const [filters, setFilters] = useState({
    category: "all", minPrice: 0, maxPrice: maxPrice,
  });

  const filtered = items.filter((item) => {
    const catOk = filters.category === "all" || item.category === filters.category;
    const price = item.price || 0;
    const priceOk = price === 0 || (price >= filters.minPrice && price <= filters.maxPrice);
    return catOk && priceOk;
  });

  return (
    <section className="wishlist-section">
      <div className="section-header">
        <div>
          <p className="section-subtitle">{subtitle}</p>
          <h2 className="section-title">{title}</h2>
        </div>
        <span className="item-count">{filtered.length} / {items.length}</span>
      </div>

      {showFilter && (
  <FilterBar filters={filters} setFilters={setFilters} maxPrice={maxPrice} />
)}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{items.length === 0 ? "nothing here yet." : "no items match these filters."}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} isOwner={isOwner}
              section={section} onDelete={onDelete} onMove={onMove} />
          ))}
        </div>
      )}
    </section>
  );
}
