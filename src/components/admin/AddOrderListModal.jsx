import { useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AddOrderListModal({ onClose, onAdded }) {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [makingPrice, setMakingPrice] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!type.trim() || !name.trim()) {
      setError('Type and name are required');
      return;
    }
    if (sellingPrice === '' || makingPrice === '' || Number(sellingPrice) < 0 || Number(makingPrice) < 0) {
      setError('Please enter valid prices');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createOrderListItem({
        type: type.trim(),
        name: name.trim(),
        sellingPrice: Number(sellingPrice),
        makingPrice: Number(makingPrice),
      });
      showToast('New order added successfully');
      onAdded(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="modal">
          <h2 className="modal__title">Add Order List Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Food, Drink"
                value={type}
                onChange={(e) => setType(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Pizza"
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
                placeholder="0.00"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Making Price</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={makingPrice}
                onChange={(e) => setMakingPrice(e.target.value)}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button className="btn btn--primary btn--block" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add New Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
