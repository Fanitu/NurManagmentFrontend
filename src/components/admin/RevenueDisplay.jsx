import { useState,useEffect } from 'react';
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

// ── Daily Card ────────────────────────────────────────────────────────────────
function DailyCard({ day }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');

  const handleViewAll = async () => {
    if (expanded) { setExpanded(false); return; }
    if (detail)   { setExpanded(true);  return; }
    setIsLoadingDetail(true);
    setDetailError('');
    try {
      const data = await api.getDailyDetail(day.date);
      setDetail(data);
      setExpanded(true);
    } catch (err) {
      setDetailError('Could not load detail');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

      <button
        className="btn btn--view-all"
        onClick={handleViewAll}
        disabled={isLoadingDetail}
      >
        {isLoadingDetail ? 'Loading…' : expanded ? 'ዝጋው ▲' : 'ዕለታዊ ዝርዝሮች ▼'}
      </button>

      {detailError && <div className="form-error">{detailError}</div>}

      {expanded && detail && (
  <div className="daily-detail">

    {/* Active orders */}
    <div className="daily-detail__section">
      <div className="daily-detail__section-title">
        ትዕዛዞች ({detail.orders.length})
      </div>
      {detail.orders.length === 0 && (
        <div className="daily-detail__empty">No orders this day</div>
      )}
      {detail.orders.map((o) => (
        <div key={o._id} className="daily-detail__row">
          <div className="daily-detail__row-left">
            <span className="daily-detail__name">{o.name}</span>
            {o.type && <span className="daily-detail__type">{o.type}</span>}
          </div>
          <div className="daily-detail__row-right">
            <span className="daily-detail__price">
              {Number(o.sellingPrice).toFixed(2)} Br
            </span>
            <span className="daily-detail__time">{formatTime(o.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Running costs */}
    <div className="daily-detail__section">
      <div className="daily-detail__section-title">
        የሥራ ማስኬጃ ወጪዎች ({detail.runningCosts.length})
      </div>
      {detail.runningCosts.length === 0 && (
        <div className="daily-detail__empty">ለዛሬ ምንም ዓይነት የስራ ማስኬጃ ወጪ የለም</div>
      )}
      {detail.runningCosts.map((c) => (
        <div key={c._id} className="daily-detail__row">
          <div className="daily-detail__row-left">
            <span className="daily-detail__name">{c.name}</span>
          </div>
          <div className="daily-detail__row-right">
            <span className="daily-detail__price daily-detail__price--cost">
              {Number(c.price).toFixed(2)} Br
            </span>
            <span className="daily-detail__time">{formatTime(c.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Deleted orders — only shown if any exist */}
    {detail.deletedOrders && detail.deletedOrders.length > 0 && (
      <div className="daily-detail__section daily-detail__section--deleted">
        <div className="daily-detail__section-title daily-detail__section-title--deleted">
          የተሰረዙ ትዕዛዞች ({detail.deletedOrders.length})
        </div>
        {detail.deletedOrders.map((o) => (
          <div key={o._id} className="daily-detail__row daily-detail__row--deleted">
            <div className="daily-detail__row-left">
              <span className="daily-detail__name daily-detail__name--deleted">
                {o.name}
              </span>
              {o.type && <span className="daily-detail__type">{o.type}</span>}
              <span className="daily-detail__delete-reason">
                ምክንያት: {o.deletedReason}
              </span>
            </div>
            <div className="daily-detail__row-right">
              <span className="daily-detail__price daily-detail__price--deleted">
                -{Number(o.sellingPrice).toFixed(2)} Br
              </span>
              <span className="daily-detail__time">
                {formatTime(o.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}

  </div>
)}
    </div>
  );
}

// ── Range Card (Weekly + Monthly) ─────────────────────────────────────────────
function RangeCard({ start, end, data, type }) {
  const netProfit = (Number(data.totalRevenue) || 0) - (Number(data.runningCost) || 0);
  const [expanded, setExpanded]               = useState(false);
  const [detail, setDetail]                   = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError]         = useState('');

  const handleViewAll = async () => {
    if (expanded) { setExpanded(false); return; }
    if (detail)   { setExpanded(true);  return; }
    setIsLoadingDetail(true);
    setDetailError('');
    try {
      const result = type === 'weekly'
        ? await api.getWeeklyDetail(start)
        : await api.getMonthlyDetail(start);
      setDetail(result);
      setExpanded(true);
    } catch (err) {
      setDetailError('Could not load detail');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <div className="revenue-card">
      <div className="revenue-card__date">
        {formatLongDate(start)} - {formatLongDate(end)}
      </div>

      {/* Weekly: 3 metrics */}
      {type === 'weekly' && (
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
      )}

      {/* Monthly: 4 metrics */}
      {type === 'monthly' && (
        <div className="revenue-card__grid revenue-card__grid--2col">
          <div className="revenue-metric">
            <div className="revenue-metric__label">ጠቅላላ ገቢ</div>
            <MetricValue value={data.totalRevenue} />
          </div>
          <div className="revenue-metric">
            <div className="revenue-metric__label">የሥራ ማስኬጃ ወጪ</div>
            <MetricValue value={data.runningCost} />
          </div>
          <div className="revenue-metric">
            <div className="revenue-metric__label">ወርሃዊ ወጪዎች</div>
            <MetricValue value={data.totalMonthlyExpenses} />
          </div>
          <div className="revenue-metric revenue-metric--full">
            <div className="revenue-metric__label">ጠቅላላ ትርፍ ከሁሉም ክፍያ በኋላ</div>
            <MetricValue value={data.netProfitAfterAll} />
          </div>
        </div>
      )}

      {/* View button — both weekly and monthly */}
      <button
        className="btn btn--view-all"
        onClick={handleViewAll}
        disabled={isLoadingDetail}
      >
        {isLoadingDetail
          ? 'Loading…'
          : expanded
          ? 'ዝጋው ▲'
          : type === 'weekly'
          ? 'ሳምንታዊ ዝርዝሮች ይመልከቱት ▼'
          : 'ወርሃዊ ዝርዝሮች ይመልከቱት ▼'}
      </button>

      {detailError && <div className="form-error">{detailError}</div>}

      {/* ── Weekly expanded detail (now flat grouped, same as monthly) ── */}
      {expanded && detail && type === 'weekly' && (
        <div className="daily-detail">

          {/* Orders grouped flat */}
          <div className="monthly-detail__section">
            <div className="monthly-detail__section-header">
              <span>ትዕዛዞች</span>
              <span>{detail.groupedOrders.reduce((s, o) => s + o.count, 0)} ትዕዛዝ</span>
            </div>

            {detail.groupedOrders.length === 0 && (
              <div className="daily-detail__empty">No orders this week</div>
            )}

            {detail.groupedOrders.map((o, idx) => (
              <div key={idx} className="daily-detail__row">
                <div className="daily-detail__row-left">
                  <span className="daily-detail__name">{o.name} ({o.count})</span>
                  {o.type && <span className="daily-detail__type">{o.type}</span>}
                </div>
                <div className="daily-detail__row-right">
                  <span className="daily-detail__price">
                    {o.count} × {Number(o.sellingPrice).toFixed(2)} = {Number(o.total).toFixed(2)} Br
                  </span>
                </div>
              </div>
            ))}

            <div className="monthly-detail__sum monthly-detail__sum--revenue">
              <span>ጠቅላላ የሽያጭ ድምር</span>
              <span>{formatMoney(detail.totalOrdersSum)}</span>
            </div>
          </div>

          {/* Running costs grouped flat */}
          <div className="monthly-detail__section">
            <div className="monthly-detail__section-header">
              <span>የሥራ ማስኬጃ ወጪዎች</span>
              <span>{detail.groupedCosts.reduce((s, c) => s + c.count, 0)} ወጪ</span>
            </div>

            {detail.groupedCosts.length === 0 && (
              <div className="daily-detail__empty">No running costs this week</div>
            )}

            {detail.groupedCosts.map((c, idx) => (
              <div key={idx} className="daily-detail__row">
                <div className="daily-detail__row-left">
                  <span className="daily-detail__name">{c.name} ({c.count})</span>
                </div>
                <div className="daily-detail__row-right">
                  <span className="daily-detail__price daily-detail__price--cost">
                    {c.count} ጊዜ — ጠቅላላ: {Number(c.total).toFixed(2)} Br
                  </span>
                </div>
              </div>
            ))}

            <div className="monthly-detail__sum monthly-detail__sum--cost">
              <span>ጠቅላላ የሥራ ማስኬጃ ወጪ ድምር</span>
              <span>{formatMoney(detail.totalCostsSum)}</span>
            </div>
          </div>

          {/* Deleted orders — only shown if any exist */}
          {detail.deletedOrders && detail.deletedOrders.length > 0 && (
            <div className="monthly-detail__section daily-detail__section--deleted">
              <div className="monthly-detail__section-header" style={{ background: 'var(--danger-tint)', color: 'var(--danger)' }}>
                <span>የተሰረዙ ትዕዛዞች</span>
                <span>{detail.deletedOrders.length} ትዕዛዝ</span>
              </div>

              {detail.deletedOrders.map((o, idx) => (
                <div key={idx} className="daily-detail__row daily-detail__row--deleted">
                  <div className="daily-detail__row-left">
                    <span className="daily-detail__name daily-detail__name--deleted">
                      {o.name}
                    </span>
                    {o.type && <span className="daily-detail__type">{o.type}</span>}
                    <span className="daily-detail__delete-reason">
                      ምክንያት: {o.deletedReason}
                    </span>
                    <span className="daily-detail__type">
                      ቀን: {formatLongDate(o.originalDate)}
                    </span>
                  </div>
                  <div className="daily-detail__row-right">
                    <span className="daily-detail__price daily-detail__price--deleted">
                      -{Number(o.sellingPrice).toFixed(2)} Br
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ── Monthly expanded detail ── */}
      {expanded && detail && type === 'monthly' && (
        <div className="daily-detail">

          <div className="monthly-detail__section">
            <div className="monthly-detail__section-header">
              <span>ትዕዛዞች</span>
              <span>{detail.groupedOrders.reduce((s, o) => s + o.count, 0)} ትዕዛዝ</span>
            </div>

            {detail.groupedOrders.length === 0 && (
              <div className="daily-detail__empty">No orders this month</div>
            )}

            {detail.groupedOrders.map((o, idx) => (
              <div key={idx} className="daily-detail__row">
                <div className="daily-detail__row-left">
                  <span className="daily-detail__name">{o.name} ({o.count})</span>
                  {o.type && <span className="daily-detail__type">{o.type}</span>}
                </div>
                <div className="daily-detail__row-right">
                  <span className="daily-detail__price">
                    {o.count} × {Number(o.sellingPrice).toFixed(2)} = {Number(o.total).toFixed(2)} Br
                  </span>
                </div>
              </div>
            ))}

            <div className="monthly-detail__sum monthly-detail__sum--revenue">
              <span>ጠቅላላ የሽያጭ ድምር</span>
              <span>{formatMoney(detail.totalOrdersSum)}</span>
            </div>
          </div>

          <div className="monthly-detail__section">
            <div className="monthly-detail__section-header">
              <span>የሥራ ማስኬጃ ወጪዎች</span>
              <span>{detail.groupedCosts.reduce((s, c) => s + c.count, 0)} ወጪ</span>
            </div>

            {detail.groupedCosts.length === 0 && (
              <div className="daily-detail__empty">No running costs this month</div>
            )}

            {detail.groupedCosts.map((c, idx) => (
              <div key={idx} className="daily-detail__row">
                <div className="daily-detail__row-left">
                  <span className="daily-detail__name">{c.name} ({c.count})</span>
                </div>
                <div className="daily-detail__row-right">
                  <span className="daily-detail__price daily-detail__price--cost">
                    {c.count} ጊዜ — ጠቅላላ: {Number(c.total).toFixed(2)} Br
                  </span>
                </div>
              </div>
            ))}

            <div className="monthly-detail__sum monthly-detail__sum--cost">
              <span>ጠቅላላ የሥራ ማስኬጃ ወጪ ድምር</span>
              <span>{formatMoney(detail.totalCostsSum)}</span>
            </div>
          </div>

          <div className="monthly-detail__section">
            <div className="monthly-detail__section-header">
              <span>ወርሃዊ ወጪዎች</span>
              <span>{detail.monthlyExpenses.length} ወጪ</span>
            </div>

            {detail.monthlyExpenses.length === 0 && (
              <div className="daily-detail__empty">No monthly expenses</div>
            )}

            {detail.monthlyExpenses.map((e, idx) => (
              <div key={idx} className="daily-detail__row">
                <div className="daily-detail__row-left">
                  <span className="daily-detail__name">{e.name}</span>
                  <span className="daily-detail__type">
                    {e.isActive ? '● የዚህ ወር ክፍያዎች' : '○የዚህ ወር የተሰረዙ ክፍያዎች'}
                  </span>
                </div>
                <div className="daily-detail__row-right">
                  <span className="daily-detail__price daily-detail__price--expense">
                    {formatMoney(e.proRatedAmount)}
                  </span>
                </div>
              </div>
            ))}

            <div className="monthly-detail__sum monthly-detail__sum--expense">
              <span>ጠቅላላ ወርሃዊ ወጪ ድምር</span>
              <span>{formatMoney(detail.totalExpensesSum)}</span>
            </div>
          </div>

          {/* Deleted orders in monthly view too */}
          {detail.deletedOrders && detail.deletedOrders.length > 0 && (
            <div className="monthly-detail__section daily-detail__section--deleted">
              <div className="monthly-detail__section-header" style={{ background: 'var(--danger-tint)', color: 'var(--danger)' }}>
                <span>የተሰረዙ ትዕዛዞች</span>
                <span>{detail.deletedOrders.length} ትዕዛዝ</span>
              </div>

              {detail.deletedOrders.map((o, idx) => (
                <div key={idx} className="daily-detail__row daily-detail__row--deleted">
                  <div className="daily-detail__row-left">
                    <span className="daily-detail__name daily-detail__name--deleted">
                      {o.name}
                    </span>
                    {o.type && <span className="daily-detail__type">{o.type}</span>}
                    <span className="daily-detail__delete-reason">
                      ምክንያት: {o.deletedReason}
                    </span>
                    <span className="daily-detail__type">
                      ቀን: {formatLongDate(o.originalDate)}
                    </span>
                  </div>
                  <div className="daily-detail__row-right">
                    <span className="daily-detail__price daily-detail__price--deleted">
                      -{Number(o.sellingPrice).toFixed(2)} Br
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
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
          <RangeCard
            key={week.weekStart}
            start={week.weekStart}
            end={week.weekEnd}
            data={week}
            type="weekly"
          />
        ))}

      {!isLoading &&
        period === 'monthly' &&
        data.map((month) => (
          <RangeCard
            key={month.monthStart}
            start={month.monthStart}
            end={month.monthEnd}
            data={month}
            type="monthly"
          />
        ))}
    </div>
  );
}