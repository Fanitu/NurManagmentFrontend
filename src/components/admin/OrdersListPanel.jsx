import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import OrderListCard from './OrderListCard';
import AddOrderListModal from './AddOrderListModal';

export default function OrdersListPanel() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const loadItems = () => {
    setIsLoading(true);
    setError('');
    api
      .getOrderList()
      .then((data) => setItems(data))
      .catch(() => setError('Could not load order list'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    const previous = items;
    setItems((prev) => prev.filter((i) => i._id !== id)); // optimistic
    try {
      await api.deleteOrderListItem(id);
    } catch (err) {
      setItems(previous);
      setError('Failed to delete item');
    }
  };

  const handleUpdate = async (id, payload) => {
    const updated = await api.updateOrderListItem(id, payload);
    setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
  };

  const handleAdded = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <div>
      <h2 className="panel-title">የትዕዛዝ ዝርዝር</h2>

      {isLoading && <div className="loading-state">የትዕዛዝ ዝርዝርን በመጫን ላይ…</div>}
      {error && <div className="form-error">{error}</div>}

      {!isLoading && items.length === 0 && (
        <div className="empty-state">እስካሁን ምንም የትዕዛዝ ዝርዝር የሉም። ለመጀመር አንዱን ይመዝግቡ።</div>
      )}

      {!isLoading &&
        items.map((item) => (
          <OrderListCard key={item._id} item={item} onDelete={handleDelete} onUpdate={handleUpdate} />
        ))}

      <button className="btn btn--primary fab" onClick={() => setShowAddModal(true)}>
        + ትዕዛዝ ጨምር
      </button>

      {showAddModal && (
        <AddOrderListModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />
      )}
    </div>
  );
}
