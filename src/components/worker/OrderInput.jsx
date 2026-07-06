import { useState, useEffect, useMemo } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function OrderInput() {
  const [catalog, setCatalog] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [price, setPrice] = useState('');
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    api
      .getOrderList()
      .then((items) => setCatalog(items))
      .catch(() => setError('Could not load order types'))
      .finally(() => setIsLoadingCatalog(false));
  }, []);

  // group catalog items by type for <optgroup>
  const groupedByType = useMemo(() => {
    const groups = {};
    catalog.forEach((item) => {
      const type = item.type || 'Other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });
    return groups;
  }, [catalog]);

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedItemId(id);
    const item = catalog.find((c) => c._id === id);
    if (item) {
      setPrice(String(item.sellingPrice));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const item = catalog.find((c) => c._id === selectedItemId);
    if (!item) {
      setError('Please select an order type');
      return;
    }
    if (!price || Number(price) < 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createOrder({
        orderListId: item._id,
        name: item.name,
        sellingPrice: Number(price),
      });
      showToast('Order successfully saved');
      setSelectedItemId('');
      setPrice('');
    } catch (err) {
      setError(err.message || 'Failed to save order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCatalog) {
    return <div className="loading-state">Loading order types…</div>;
  }

  return (
    <div>
      <h2 className="panel-title">Order Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="order-select">
            Order Type
          </label>
          <select
            id="order-select"
            className="form-select"
            value={selectedItemId}
            onChange={handleSelectChange}
          >
            <option value="" disabled>
              Select an order
            </option>
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
          <label className="form-label" htmlFor="order-price">
            Price
          </label>
          <input
            id="order-price"
            className="form-input"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="btn btn--primary btn--block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}
