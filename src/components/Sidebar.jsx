import { 
  Store, 
  LayoutGrid, 
  UtensilsCrossed, 
  ReceiptText, 
  BarChart3, 
  UserCircle2, 
  CircleDot 
} from 'lucide-react';
import { usePos } from '../context/PosContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, cart, products, transactions } = usePos();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    {
      id: 'pos',
      label: 'Layar Kasir (POS)',
      icon: LayoutGrid,
      badge: totalCartItems > 0 ? totalCartItems : null,
      badgeColor: 'badge-accent',
    },
    {
      id: 'products',
      label: 'Kelola Menu',
      icon: UtensilsCrossed,
      badge: products.length,
    },
    {
      id: 'history',
      label: 'Riwayat Transaksi',
      icon: ReceiptText,
      badge: transactions.length,
    },
    {
      id: 'reports',
      label: 'Laporan Penjualan',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="pos-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Store className="brand-icon" size={26} />
        </div>
        <div className="brand-info">
          <h2>Kopi & Resto</h2>
          <span className="brand-sub">Smart POS System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-text">{item.label}</span>
              {item.badge !== null && item.badge !== undefined && (
                <span className={`nav-badge ${item.badgeColor || ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="cashier-card">
          <UserCircle2 size={38} className="cashier-avatar" />
          <div className="cashier-details">
            <span className="cashier-name">Budi Santoso</span>
            <span className="cashier-shift">Kasir • Shift Pagi</span>
          </div>
          <div className="status-indicator" title="Online POS Shift">
            <CircleDot size={14} className="online-dot" />
          </div>
        </div>
      </div>
    </aside>
  );
}
