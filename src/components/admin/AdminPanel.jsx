import { useState } from 'react';
import RevenueDisplay from './RevenueDisplay';
import OrdersListPanel from './OrdersListPanel';
import RunningCostInput from '../worker/RunningCostInput';

const TABS = [
  { key: 'revenue', label: 'ገቢ' },
  { key: 'Running-Cost', label: 'የሥራ ማስኬጃ ወጪ' },
  { key: 'ordersList', label: 'የትዕዛዝ ዝርዝር' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('revenue');

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
        {activeTab === 'revenue' && <RevenueDisplay />}
        {activeTab === 'Running-Cost' && <RunningCostInput />}
        {activeTab === 'ordersList' && <OrdersListPanel />}
      </main>
    </>
  );
}
