const CATEGORIES = ["all", "fashion", "home", "tech", "beauty", "skincare", "books", "food", "stationery", "art", "other"];

export default function FilterBar({ filters, setFilters, maxPrice }) {
  const handleCategory = (e) =>
    setFilters((p) => ({ ...p, category: e.target.value }));

  const handleReset = () =>
    setFilters({ category: "all", minPrice: 0, maxPrice: maxPrice });

  const isFiltered =
    filters.category !== "all" ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxPrice;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">category</label>
        <select className="filter-select" value={filters.category} onChange={handleCategory}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "all" ? "all categories" : c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">price range (₹)</label>
        <div className="price-inputs">
          <input
            className="form-input price-input"
            type="number"
            placeholder="min"
            value={filters.minPrice || ""}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: Number(e.target.value) || 0 }))}
            min="0"
          />
          <span className="price-sep">—</span>
          <input
            className="form-input price-input"
            type="number"
            placeholder="max"
            value={filters.maxPrice >= maxPrice ? "" : filters.maxPrice}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) || maxPrice }))}
            min="0"
          />
        </div>
      </div>

      {isFiltered && (
        <button className="filter-reset" onClick={handleReset}>reset filters</button>
      )}
    </div>
  );
}