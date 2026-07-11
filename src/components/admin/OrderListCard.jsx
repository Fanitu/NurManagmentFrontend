import { useState } from 'react';

export default function OrderListCard({ item, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState(item.type);
  const [name, setName] = useState(item.name);
  const [sellingPrice, setSellingPrice] = useState(String(item.sellingPrice));
  const [makingPrice, setMakingPrice] = useState(String(item.makingPrice));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateNow = async () => {
    setError('');
    if (!type.trim() || !name.trim()) {
      setError('Type and name are required');
      return;
    }
    if (sellingPrice === '' || Number(sellingPrice) < 0 ) {
      setError('Please enter a valid selling price');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(item._id, {
        type: type.trim(),
        name: name.trim(),
        sellingPrice: Number(sellingPrice),
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="order-card__top">
        <div>
          <div className="order-card__name">{item.name}</div>
          <div className="order-card__type">{item.type}</div>
        </div>
        <div className="order-card__price">{item.sellingPrice.toFixed(2)} Br</div>
      </div>
      {/* <div className="order-card__time">Making price: {item.makingPrice.toFixed(2)} Br</div>
 */}
      <div className="order-card__actions">
        <button className="btn btn--danger" onClick={() => onDelete(item._id)}>
          Delete
        </button>
        <button className="btn btn--primary" onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? 'Cancel' : 'Update'}
        </button>
      </div>

      {isEditing && (
        <div className="order-card__edit-block">
          <div className="form-group">
            <label className="form-label">Type</label>
            <input
              className="form-input"
              type="text"
              placeholder={item.type}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              placeholder={item.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Selling Price</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder={String(item.sellingPrice)}
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>
          {/* <div className="form-group">
            <label className="form-label">Making Price</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder={String(item.makingPrice)}
              value={makingPrice}
              onChange={(e) => setMakingPrice(e.target.value)}
            />
          </div> */}

          {error && <div className="form-error">{error}</div>}

          <button className="btn btn--primary btn--block" onClick={handleUpdateNow} disabled={isSaving}>
            {isSaving ? 'Updating…' : 'Update Now'}
          </button>
        </div>
      )}
    </div>
  );
}
