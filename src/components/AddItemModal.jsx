import { useState } from "react";

const CATEGORIES = ["fashion", "home", "tech", "beauty", "skincare", "books", "food", "stationery", "art", "other"];

export default function AddItemModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    title: "", imageUrl: "", link: "", category: "", section: "want", price: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd({ ...form, price: form.price ? Number(form.price) : 0 });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">add to wishlist</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">title *</label>
            <input className="form-input" name="title" placeholder="Acne Studios Scarf"
              value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">image url</label>
            <input className="form-input" name="imageUrl" placeholder="https://..."
              value={form.imageUrl} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">product link</label>
            <input className="form-input" name="link" placeholder="https://..."
              value={form.link} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">category</label>
              <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                <option value="">— none —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">section</label>
              <select className="form-input" name="section" value={form.section} onChange={handleChange}>
                <option value="want">want</option>
                <option value="have">have</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">price in ₹ (optional)</label>
            <input className="form-input" name="price" type="number"
              placeholder="e.g. 4500" value={form.price} onChange={handleChange} min="0" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>add item</button>
        </div>
      </div>
    </div>
  );
}
