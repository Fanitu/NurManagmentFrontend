import { useState } from 'react';

export default function DeleteModal({ orderName, onClose, onConfirm }) {
  const [reason, setReason]       = useState('');
  const [error, setError]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setError('');
    if (!reason.trim()) {
      setError('ምክንያት ሳይሰጡ ትዕዛዝ መሰረዝ አይቻልም');
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
    } catch (err) {
      setError(err.message || 'Failed to delete');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="modal">
          <h2 className="modal__title">ትዕዛዝ ሰርዝ</h2>
          <p className="delete-modal__order-name">"{orderName}"</p>

          <div className="form-group">
            <label className="form-label">የመሰረዝ ምክንያት</label>
            <input
              className="form-input"
              type="text"
              placeholder="ምክንያት ያስገቡ…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="delete-modal__actions">
            <button className="btn btn--ghost-dark" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn--danger-solid"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'በመሰረዝ ላይ…' : 'ሰርዝ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}