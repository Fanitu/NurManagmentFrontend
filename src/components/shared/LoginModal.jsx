import { useState } from 'react';


export default function LoginModal({ onClose, onLoginSuccess }) {
  const [name, setName]               = useState('');
  const [password, setPassword]       = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [error, setError]             = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    if (!restaurantId.trim()) {
      setError('Restaurant ID is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onLoginSuccess(name.trim(), password, restaurantId.trim().toUpperCase());
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="modal">
          <h2 className="modal__title">Login</h2>
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label" htmlFor="login-restaurant-id">
                Restaurant ID
              </label>
              <input
                id="login-restaurant-id"
                className="form-input"
                type="text"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value.toUpperCase())}
                placeholder="e.g. OMS-2847"
                autoFocus
                autoCapitalize="characters"
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-name">
                Name
              </label>
              <input
                id="login-name"
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button
              className="btn btn--primary btn--block"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}