import { useState, useEffect } from 'react';
import { api } from '../../api/client';

const PERIODS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

function formatMoney(value) {
  const n = Number(value) || 0;
  return `${n.toFixed(2)} Br`;
}

// "Monday 30 June 2026" style formatting, used for daily and for both ends
// of the weekly/monthly range
function formatLongDate(dateInput) {
  const date = new Date(dateInput);
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleDateString(undefined, { month: 'long' });
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

function MetricValue({ value }) {
  const n = Number(value) || 0;
  const cls = n < 0 ? 'revenue-metric__value--negative' : 'revenue-metric__value--positive';
  return <div className={`revenue-metric__value ${cls}`}>{formatMoney(n)}</div>;
}

function DailyCard({ day }) {
  return (
    <div className="revenue-card">
      <div className="revenue-card__date">{formatLongDate(day.date)}</div>
      <div className="revenue-card__grid">
        <div className="revenue-metric">
          <div className="revenue-metric__label">Revenue</div>
          <MetricValue value={day.totalRevenue} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">Profit</div>
          <MetricValue value={day.profit} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">Running Cost</div>
          <MetricValue value={day.runningCost} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">Net Income</div>
          <MetricValue value={day.netIncome} />
        </div>
      </div>
    </div>
  );
}

function RangeCard({ start, end, data }) {
  return (
    <div className="revenue-card">
      <div className="revenue-card__date">
        {formatLongDate(start)} - {formatLongDate(end)}
      </div>
      <div className="revenue-card__grid">
        <div className="revenue-metric">
          <div className="revenue-metric__label">Revenue</div>
          <MetricValue value={data.totalRevenue} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">Profit</div>
          <MetricValue value={data.profit} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">Running Cost</div>
          <MetricValue value={data.runningCost} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">Net Income</div>
          <MetricValue value={data.netIncome} />
        </div>
      </div>
    </div>
  );
}

export default function RevenueDisplay() {
  const [period, setPeriod] = useState('daily');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError('');

    const fetcher =
      period === 'daily'
        ? api.getDailyRevenue
        : period === 'weekly'
        ? api.getWeeklyRevenue
        : api.getMonthlyRevenue;

    fetcher()
      .then((result) => setData(result))
      .catch(() => setError('Could not load revenue data'))
      .finally(() => setIsLoading(false));
  }, [period]);

  return (
    <div>
      <h2 className="panel-title">Revenue</h2>

      <div className="period-tabs">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={`btn btn--tab ${period === p.key ? 'btn--tab-active' : ''}`}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="loading-state">Loading {period} revenue…</div>}
      {error && <div className="form-error">{error}</div>}

      {!isLoading && data.length === 0 && (
        <div className="empty-state">No revenue data for this period yet.</div>
      )}

      {!isLoading &&
        period === 'daily' &&
        data.map((day) => <DailyCard key={day.date} day={day} />)}

      {!isLoading &&
        period === 'weekly' &&
        data.map((week) => (
          <RangeCard key={week.weekStart} start={week.weekStart} end={week.weekEnd} data={week} />
        ))}

      {!isLoading &&
        period === 'monthly' &&
        data.map((month) => (
          <RangeCard key={month.monthStart} start={month.monthStart} end={month.monthEnd} data={month} />
        ))}
    </div>
  );
}