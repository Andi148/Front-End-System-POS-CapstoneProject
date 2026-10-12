import { useState } from 'react';
import { 
  Search, 
  Printer, 
  Receipt, 
  Calendar, 
  Filter, 
  ArrowUpRight 
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function TransactionHistory() {
  const { transactions, setActiveReceipt, formatIDR } = usePos();

  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesMethod = filterMethod === 'all' || t.paymentMethod === filterMethod;
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (t.tableNumber && t.tableNumber.includes(search));
    return matchesMethod && matchesSearch;
  });

  const getMethodBadge = (method) => {
    switch (method) {
      case 'cash':
        return <span className="method-badge cash">Tunai</span>;
      case 'qris':
        return <span className="method-badge qris">QRIS</span>;
      case 'debit':
        return <span className="method-badge debit">Debit</span>;
      case 'transfer':
        return <span className="method-badge transfer">Transfer</span>;
      default:
        return <span className="method-badge">{method}</span>;
    }
  };

  return (
    <div className="history-view">
      {/* Header bar */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Riwayat Transaksi Penjualan</h1>
          <p className="view-subtitle">Semua nota pesanan yang telah selesai dapat dipantau dan dicetak ulang</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="management-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Cari ID Nota, Meja, atau Nama Pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select-box">
          <label>Metode Bayar:</label>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="all">Semua Metode</option>
            <option value="cash">Tunai / Cash</option>
            <option value="qris">QRIS</option>
            <option value="debit">Kartu Debit</option>
            <option value="transfer">Transfer Bank</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-card">
        <table className="management-table">
          <thead>
            <tr>
              <th>No. Nota</th>
              <th>Waktu Transaksi</th>
              <th>Pelanggan / Meja</th>
              <th>Tipe Order</th>
              <th>Item Pesanan</th>
              <th>Metode</th>
              <th>Total Pembayaran</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">
                  Belum ada riwayat transaksi yang cocok.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((trx) => {
                const totalQty = trx.items.reduce((acc, i) => acc + i.quantity, 0);

                return (
                  <tr key={trx.id}>
                    <td>
                      <span className="receipt-id-tag">{trx.id}</span>
                    </td>
                    <td>
                      <div className="time-cell">
                        <Calendar size={13} />
                        <span>{trx.date}</span>
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <strong>{trx.customerName || 'Umum'}</strong>
                        {trx.tableNumber && (
                          <span className="table-tag">Meja {trx.tableNumber}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`order-type-badge ${trx.orderType}`}>
                        {trx.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}
                      </span>
                    </td>
                    <td>
                      <span className="items-summary" title={trx.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}>
                        {totalQty} item ({trx.items.length} jenis)
                      </span>
                    </td>
                    <td>{getMethodBadge(trx.paymentMethod)}</td>
                    <td>
                      <strong className="grand-price-text">
                        {formatIDR(trx.total)}
                      </strong>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="reprint-btn"
                          onClick={() => setActiveReceipt(trx)}
                          title="Lihat & Cetak Ulang Struk"
                        >
                          <Printer size={15} />
                          <span>Struk</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
