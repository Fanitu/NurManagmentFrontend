import { useState } from 'react';
import OrderInput from './OrderInput';
import RunningCostInput from './RunningCostInput';
import TodaysOrders from './TodaysOrders';

const TABS = [
  { key: 'order', label: 'Order Input' },
  { key: 'runningCost', label: 'Running Cost Input' },
  { key: 'todaysOrders', label: "Todays Total Orders" },
];

export default function WorkerPanel() {
  const [activeTab, setActiveTab] = useState('order');

  return (
    <>
      <nav className="app-nav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`app-nav__btn ${activeTab === tab.key ? 'app-nav__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'order' && <OrderInput />}
        {activeTab === 'runningCost' && <RunningCostInput />}
        {activeTab === 'todaysOrders' && <TodaysOrders />}
      </main>
    </>
  );
}
