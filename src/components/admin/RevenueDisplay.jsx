import { useState, useEffect } from 'react';
import { api } from '../../api/client';

const PERIODS = [
  { key: 'daily', label: 'በየቀኑ' },
  { key: 'weekly', label: 'ሳምንታዊ' },
  { key: 'monthly', label: 'ወርሃዊ' },
];

function formatMoney(value) {
  const n = Number(value) || 0;
  return `${n.toFixed(2)} Br`;
}

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

// Daily: only Total Revenue + Total Running Cost
function DailyCard({ day }) {
  return (
    <div className="revenue-card">
      <div className="revenue-card__date">{formatLongDate(day.date)}</div>
      <div className="revenue-card__grid revenue-card__grid--2col">
        <div className="revenue-metric">
          <div className="revenue-metric__label">ጠቅላላ ገቢ</div>
          <MetricValue value={day.totalRevenue} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">የሥራ ማስኬጃ ወጪ</div>
          <MetricValue value={day.runningCost} />
        </div>
      </div>
    </div>
  );
}

// Weekly / Monthly: Total Revenue + Total Running Cost + Net Profit (revenue - runningCost)
function RangeCard({ start, end, data }) {
  const netProfit = (Number(data.totalRevenue) || 0) - (Number(data.runningCost) || 0);
  return (
    <div className="revenue-card">
      <div className="revenue-card__date">
        {formatLongDate(start)} - {formatLongDate(end)}
      </div>
      <div className="revenue-card__grid revenue-card__grid--3col">
        <div className="revenue-metric">
          <div className="revenue-metric__label">ጠቅላላ ገቢ</div>
          <MetricValue value={data.totalRevenue} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">የሥራ ማስኬጃ ወጪ</div>
          <MetricValue value={data.runningCost} />
        </div>
        <div className="revenue-metric">
          <div className="revenue-metric__label">ጠቅላላ ትርፍ</div>
          <MetricValue value={netProfit} />
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
      <h2 className="panel-title">ገቢ</h2>

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
        <div className="empty-state">ምንም መረጃ አልተገኘም.</div>
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