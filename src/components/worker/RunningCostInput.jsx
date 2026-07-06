import { useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function RunningCostInput() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    if (!price || Number(price) < 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createRunningCost({ name: name.trim(), price: Number(price) });
      showToast('Running cost saved successfully');
      setName('');
      setPrice('');
    } catch (err) {
      setError(err.message || 'Failed to save running cost');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="panel-title">Running Cost Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="cost-name">
            Name
          </label>
          <input
            id="cost-name"
            className="form-input"
            type="text"
            placeholder="e.g. Gas refill"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cost-price">
            Price
          </label>
          <input
            id="cost-price"
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
          {isSubmitting ? 'Saving…' : 'Submit Running Cost'}
        </button>
      </form>
    </div>
  );
}
