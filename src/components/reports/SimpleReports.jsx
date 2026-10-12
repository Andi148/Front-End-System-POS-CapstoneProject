import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Building2 
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function SimpleReports() {
  const { transactions, formatIDR } = usePos();

  // Metrics
  const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
  const totalTransactionsCount = transactions.length;
  const averageTicket = totalTransactionsCount > 0 ? Math.round(totalRevenue / totalTransactionsCount) : 0;
  
  const totalItemsSold = transactions.reduce(
    (acc, t) => acc + t.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  // Payment methods breakdown
  const paymentMethodStats = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total;
    return acc;
  }, {});

  // Top selling menu items
  const itemSalesMap = {};
  transactions.forEach((t) => {
    t.items.forEach((item) => {
      if (!itemSalesMap[item.name]) {
        itemSalesMap[item.name] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
      }
      itemSalesMap[item.name].quantity += item.quantity;
      itemSalesMap[item.name].revenue += item.price * item.quantity;
    });
  });

  const topSellingItems = Object.values(itemSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="reports-view">
      {/* Header bar */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Ringkasan Laporan Penjualan</h1>
          <p className="view-subtitle">Analisis performa omset, menu terlaris, dan preferensi metode pembayaran</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon-wrap">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Omset Penjualan</span>
            <strong className="kpi-val">{formatIDR(totalRevenue)}</strong>
            <span className="kpi-sub">Dari {totalTransactionsCount} transaksi</span>
          </div>
        </div>

        <div className="kpi-card orders">
          <div className="kpi-icon-wrap">
            <ShoppingBag size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Transaksi</span>
            <strong className="kpi-val">{totalTransactionsCount} Struk</strong>
            <span className="kpi-sub">Total {totalItemsSold} porsi/cup terjual</span>
          </div>
        </div>

        <div className="kpi-card average">
          <div className="kpi-icon-wrap">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Rata-rata per Pesanan</span>
            <strong className="kpi-val">{formatIDR(averageTicket)}</strong>
            <span className="kpi-sub">Average ticket size</span>
          </div>
        </div>

        <div className="kpi-card top">
          <div className="kpi-icon-wrap">
            <Award size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Menu Terfavorit</span>
            <strong className="kpi-val">{topSellingItems[0]?.name || '-'}</strong>
            <span className="kpi-sub">{topSellingItems[0]?.quantity || 0} porsi terjual</span>
          </div>
        </div>
      </div>

      {/* Analytics 2-Column Section */}
      <div className="analytics-columns-grid">
        {/* Payment Methods Card */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Distribusi Metode Pembayaran</h3>
          <p className="analytics-card-desc">Volume transaksi berdasarkan kanal pembayaran</p>

          <div className="payment-distribution-list">
            {[
              { id: 'cash', label: 'Tunai / Cash', icon: Banknote, color: '#10b981' },
              { id: 'qris', label: 'QRIS Instant', icon: QrCode, color: '#6366f1' },
              { id: 'debit', label: 'Kartu Debit EDC', icon: CreditCard, color: '#f59e0b' },
              { id: 'transfer', label: 'Transfer Bank', icon: Building2, color: '#3b82f6' },
            ].map((method) => {
              const amount = paymentMethodStats[method.id] || 0;
              const percent = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
              const Icon = method.icon;

              return (
                <div key={method.id} className="payment-stat-item">
                  <div className="payment-stat-header">
                    <div className="stat-label-wrap">
                      <Icon size={16} style={{ color: method.color }} />
                      <span>{method.label}</span>
                    </div>
                    <div className="stat-amount-wrap">
                      <strong>{formatIDR(amount)}</strong>
                      <span className="stat-percent">({percent}%)</span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: method.color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Best Sellers Card */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Top 5 Menu Paling Laris</h3>
          <p className="analytics-card-desc">Peringkat menu dengan volume penjualan tertinggi</p>

          <div className="top-sellers-list">
            {topSellingItems.length === 0 ? (
              <p className="no-data-text">Belum ada data penjualan tercatat.</p>
            ) : (
              topSellingItems.map((item, index) => (
                <div key={item.name} className="top-seller-row">
                  <span className={`rank-badge rank-${index + 1}`}>
                    #{index + 1}
                  </span>
                  <div className="seller-name-info">
                    <strong>{item.name}</strong>
                    <span>{item.quantity} porsi terjual</span>
                  </div>
                  <div className="seller-revenue">
                    <strong>{formatIDR(item.revenue)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
