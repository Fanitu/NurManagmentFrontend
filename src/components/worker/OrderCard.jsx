import { useState, useMemo } from 'react';
import DeleteModal from './DeleteModal';

export default function OrderCard({ order, catalog, onDelete, onUpdate }) {
  const [isEditing, setIsEditing]         = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editName, setEditName]           = useState(order.name);
  const [editSelectedId, setEditSelectedId] = useState('');
  const [editPrice, setEditPrice]         = useState(String(order.sellingPrice));
  const [isSaving, setIsSaving]           = useState(false);
  const [error, setError]                 = useState('');

  const groupedByType = useMemo(() => {
    const groups = {};
    catalog.forEach((item) => {
      const type = item.type || 'Other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });
    return groups;
  }, [catalog]);

  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setEditSelectedId(id);
    const item = catalog.find((c) => c._id === id);
    if (item) {
      setEditName(item.name);
      setEditPrice(String(item.sellingPrice));
    }
  };

  const handleUpdateNow = async () => {
    setError('');
    if (!editName.trim()) { setError('Name is required'); return; }
    if (!editPrice || Number(editPrice) < 0) { setError('Please enter a valid price'); return; }
    setIsSaving(true);
    try {
      await onUpdate(order._id, {
        name: editName.trim(),
        sellingPrice: Number(editPrice),
        orderListId: editSelectedId || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async (reason) => {
    await onDelete(order._id, reason);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="card">
        <div className="order-card__top">
          <div>
            <div className="order-card__name">{order.name}</div>
            {order.type && <div className="order-card__type">{order.type}</div>}
          </div>
          <div className="order-card__price">{order.sellingPrice.toFixed(2)} Br</div>
        </div>
        <div className="order-card__time">{formattedTime}</div>

        <div className="order-card__actions">
          <button className="btn btn--danger" onClick={() => setShowDeleteModal(true)}>
            ሰርዝ
          </button>
          <button className="btn btn--primary" onClick={() => setIsEditing((v) => !v)}>
            {isEditing ? 'ማዘመኛን ሰርዝ' : 'አዘምነው'}
          </button>
        </div>

        {isEditing && (
          <div className="order-card__edit-block">
            <div className="form-group">
              <label className="form-label">የትዕዛዝ አይነት</label>
              <select className="form-select" value={editSelectedId} onChange={handleSelectChange}>
                <option value="">Keep current: {order.name}</option>
                {Object.entries(groupedByType).map(([type, items]) => (
                  <optgroup label={type} key={type}>
                    {items.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ስም</label>
              <input
                className="form-input"
                type="text"
                placeholder={order.name}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ዋጋ</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder={String(order.sellingPrice)}
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button className="btn btn--primary btn--block" onClick={handleUpdateNow} disabled={isSaving}>
              {isSaving ? 'በማዘመን ላይ…' : 'አሁን ያዘምኑ'}
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <DeleteModal
          orderName={order.name}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
