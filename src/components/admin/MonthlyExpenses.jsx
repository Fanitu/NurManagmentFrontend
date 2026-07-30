import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const SUB_TABS = [
  { key: 'input', label: 'አዲስ ወጪ' },
  { key: 'list',  label: 'የወጪ ዝርዝር' },
];

// ── Input sub-tab ──────────────────────────────────────────────
function ExpenseInput() {
  const [name, setName]         = useState('');
  const [amount, setAmount]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]       = useState('');
  const { showToast }           = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter a name'); return; }
    if (!amount || Number(amount) < 0) { setError('Please enter a valid amount'); return; }
    setIsSubmitting(true);
    try {
      await api.createMonthlyExpense({ name: name.trim(), amount: Number(amount) });
      showToast('ወርሃዊ ወጪ በተሳካ ሁኔታ ተመዝግቧል');
      setName('');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="panel-title">አዲስ ወርሃዊ ወጪ</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">ስም</label>
          <input
            className="form-input"
            type="text"
            placeholder="ለምሳሌ፡ የሰራተኛ ደመወዝ፣ የቤት ኪራይ ወጪ ወዘተ"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">መጠን (Br)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn--primary btn--block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'የተመዘገበ ነው…' : 'ወርሃዊ ወጪን ይመዝግቡ'}
        </button>
      </form>
    </div>
  );
}

// ── Single expense card with expandable inline edit ────────────
function ExpenseCard({ expense, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName]   = useState(expense.name);
  const [editAmount, setEditAmount] = useState(String(expense.amount));
  const [isSaving, setIsSaving]   = useState(false);
  const [error, setError]         = useState('');

  const handleUpdate = async () => {
    setError('');
    if (!editName.trim()) { setError('Name is required'); return; }
    if (!editAmount || Number(editAmount) < 0) { setError('Enter a valid amount'); return; }
    setIsSaving(true);
    try {
      await onUpdate(expense._id, {
        name: editName.trim(),
        amount: Number(editAmount),
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = new Date(expense.createdAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="card">
      <div className="order-card__top">
        <div>
          <div className="order-card__name">{expense.name}</div>
          <div className="order-card__time">{formattedDate}</div>
        </div>
        <div className="order-card__price">{Number(expense.amount).toFixed(2)} Br</div>
      </div>

      <div className="order-card__actions">
        <button className="btn btn--danger" onClick={() => onDelete(expense._id)}>
          Delete
        </button>
        <button className="btn btn--primary" onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? 'Cancel' : 'Update'}
        </button>
      </div>

      {isEditing && (
        <div className="order-card__edit-block">
          <div className="form-group">
            <label className="form-label">ስም</label>
            <input
              className="form-input"
              type="text"
              placeholder={expense.name}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">መጠን (Br)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder={String(expense.amount)}
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn--primary btn--block" onClick={handleUpdate} disabled={isSaving}>
            {isSaving ? 'Updating…' : 'Update Now'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── List sub-tab ───────────────────────────────────────────────
function ExpenseList() {
  const [expenses, setExpenses]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    api.getAllMonthlyExpenses()
      .then(setExpenses)
      .catch(() => setError('Could not load monthly expenses'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const prev = expenses;
    setExpenses((e) => e.filter((x) => x._id !== id));
    try {
      await api.deleteMonthlyExpense(id);
    } catch {
      setExpenses(prev);
      setError('Failed to delete');
    }
  };

  const handleUpdate = async (id, payload) => {
    const updated = await api.updateMonthlyExpense(id, payload);
    setExpenses((e) => e.map((x) => (x._id === id ? updated : x)));
  };

  const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  if (isLoading) return <div className="loading-state">ወርሃዊ ወጪዎችን በመጫን ላይ…</div>;
  if (error)     return <div className="form-error">{error}</div>;

  return (
    <div>
      <h3 className="panel-title">የወርሃዊ ወጪ ዝርዝር</h3>

      {expenses.length === 0 && (
        <div className="empty-state">እስካሁን ምንም ወርሃዊ ወጪዎች አልተመዘገቡም።</div>
      )}

      {expenses.map((expense) => (
        <ExpenseCard
          key={expense._id}
          expense={expense}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}

      {expenses.length > 0 && (
        <div className="expense-total-bar">
          <span>ጠቅላላ ወርሃዊ ወጪ</span>
          <span>{total.toFixed(2)} Br</span>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function MonthlyExpenses() {
  const [activeTab, setActiveTab] = useState('input');

  return (
    <div>
      <div className="sub-nav">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`app-nav__btn ${activeTab === tab.key ? 'app-nav__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'input' && <ExpenseInput />}
      {activeTab === 'list'  && <ExpenseList />}
    </div>
  );
}