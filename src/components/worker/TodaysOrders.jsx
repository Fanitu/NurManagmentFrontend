/* import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import OrderCard from './OrderCard'; */

import { useState, useEffect, useMemo } from 'react';
import { api } from '../../api/client';
import OrderCard from './OrderCard';

export default function TodaysOrders() {
  const [orders, setOrders] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setIsLoading(true);
    setError('');
    Promise.all([api.getTodaysOrders(), api.getOrderList()])
      .then(([ordersData, catalogData]) => {
        // newest first (server already sorts, but keep it defensive)
        const sorted = [...ordersData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
        setCatalog(catalogData);
      })
      .catch(() => setError('Could not load today\'s orders'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    const previous = orders;
    setOrders((prev) => prev.filter((o) => o._id !== id)); // optimistic
    try {
      await api.deleteOrder(id);
    } catch (err) {
      setOrders(previous); // roll back on failure
      setError('Failed to delete order');
    }
  };

  const handleUpdate = async (id, payload) => {
    const updated = await api.updateOrder(id, payload);
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  };

  // recomputes automatically whenever orders changes (add/delete/update)
  const totals = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.sellingPrice) || 0), 0);
    return { totalOrders, totalRevenue };
  }, [orders]);

  return (
    <div className="todays-orders-panel">
      <h2 className="panel-title">Today's Total Orders</h2>

      {isLoading && <div className="loading-state">Loading orders…</div>}
      {error && <div className="form-error">{error}</div>}

      {!isLoading && orders.length === 0 && (
        <div className="empty-state">No orders placed yet today.</div>
      )}

      {!isLoading &&
        orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            catalog={catalog}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}

      {!isLoading && (
        <div className="todays-summary-fixed">
          <div className="todays-summary-fixed__item">
            <div className="todays-summary-fixed__label">Total Orders</div>
            <div className="todays-summary-fixed__value">{totals.totalOrders}</div>
          </div>
          <div className="todays-summary-fixed__divider" />
          <div className="todays-summary-fixed__item">
            <div className="todays-summary-fixed__label">Total Revenue</div>
            <div className="todays-summary-fixed__value">{totals.totalRevenue.toFixed(2)} Br</div>
          </div>
        </div>
      )}
    </div>
  );
}
