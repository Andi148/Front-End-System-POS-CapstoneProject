import { Printer, Check, X, Sparkles } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function ReceiptModal() {
  const { activeReceipt, setActiveReceipt, formatIDR } = usePos();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const paymentMethodLabel = {
    cash: 'TUNAI / CASH',
    qris: 'QRIS INSTANT',
    debit: 'KARTU DEBIT',
    transfer: 'TRANSFER BANK',
  }[activeReceipt.paymentMethod] || activeReceipt.paymentMethod.toUpperCase();

  return (
    <div className="modal-backdrop receipt-backdrop">
      <div className="receipt-modal-card">
        {/* Top actions bar */}
        <div className="receipt-actions-bar no-print">
          <div className="receipt-status-pill">
            <Check size={16} />
            <span>Transaksi Berhasil</span>
          </div>
          <div className="receipt-btn-group">
            <button
              type="button"
              className="print-receipt-btn"
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>Cetak Struk</span>
            </button>
            <button
              type="button"
              className="close-receipt-btn"
              onClick={() => setActiveReceipt(null)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Paper Container */}
        <div className="thermal-receipt-paper" id="printable-receipt">
          <div className="receipt-header">
            <h2 className="receipt-store-title">KOPI & RESTO NUSANTARA</h2>
            <p className="receipt-address">Jl. Diponegoro No. 45, Bandung</p>
            <p className="receipt-phone">Telp: (022) 789-1234</p>
          </div>

          <div className="receipt-divider-dash"></div>

          <div className="receipt-meta-grid">
            <div className="meta-row">
              <span>No. Nota:</span>
              <span className="mono-text">{activeReceipt.id}</span>
            </div>
            <div className="meta-row">
              <span>Tanggal:</span>
              <span>{activeReceipt.date}</span>
            </div>
            <div className="meta-row">
              <span>Kasir:</span>
              <span>{activeReceipt.cashier}</span>
            </div>
            <div className="meta-row">
              <span>Tipe:</span>
              <span className="bold-text">
                {activeReceipt.orderType === 'dine-in'
                  ? `DINE IN (Meja ${activeReceipt.tableNumber || '-'})`
                  : 'TAKE AWAY (Bawa Pulang)'}
              </span>
            </div>
            {activeReceipt.customerName && (
              <div className="meta-row">
                <span>Pelanggan:</span>
                <span>{activeReceipt.customerName}</span>
              </div>
            )}
          </div>

          <div className="receipt-divider-dash"></div>

          {/* Items list */}
          <div className="receipt-items-list">
            {activeReceipt.items.map((item, idx) => (
              <div key={idx} className="receipt-item-row">
                <div className="receipt-item-info">
                  <span className="item-name">{item.name}</span>
                  {item.note && <span className="item-note">({item.note})</span>}
                  <div className="item-calc">
                    <span>{item.quantity} x {formatIDR(item.price)}</span>
                  </div>
                </div>
                <span className="item-sum">
                  {formatIDR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="receipt-divider-dash"></div>

          {/* Totals Breakdown */}
          <div className="receipt-totals-list">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatIDR(activeReceipt.subtotal)}</span>
            </div>
            <div className="total-row">
              <span>PB1 (Pajak 10%)</span>
              <span>{formatIDR(activeReceipt.tax)}</span>
            </div>
            {activeReceipt.discount > 0 && (
              <div className="total-row discount">
                <span>Diskon Promo</span>
                <span>-{formatIDR(activeReceipt.discount)}</span>
              </div>
            )}
            <div className="receipt-divider-solid"></div>
            <div className="total-row grand-total">
              <span>TOTAL</span>
              <span>{formatIDR(activeReceipt.total)}</span>
            </div>
            <div className="total-row payment-info">
              <span>Metode Bayar</span>
              <span>{paymentMethodLabel}</span>
            </div>
            <div className="total-row">
              <span>Diterima</span>
              <span>{formatIDR(activeReceipt.amountPaid)}</span>
            </div>
            <div className="total-row change-row">
              <span>Kembalian</span>
              <span>{formatIDR(activeReceipt.change)}</span>
            </div>
          </div>

          <div className="receipt-divider-dash"></div>

          {/* Simulated barcode */}
          <div className="receipt-barcode-box">
            <div className="barcode-lines">
              <span style={{ width: '3px' }}></span>
              <span style={{ width: '1px' }}></span>
              <span style={{ width: '4px' }}></span>
              <span style={{ width: '2px' }}></span>
              <span style={{ width: '1px' }}></span>
              <span style={{ width: '5px' }}></span>
              <span style={{ width: '2px' }}></span>
              <span style={{ width: '3px' }}></span>
              <span style={{ width: '1px' }}></span>
              <span style={{ width: '4px' }}></span>
              <span style={{ width: '2px' }}></span>
              <span style={{ width: '3px' }}></span>
              <span style={{ width: '1px' }}></span>
              <span style={{ width: '5px' }}></span>
              <span style={{ width: '2px' }}></span>
            </div>
            <span className="barcode-number">{activeReceipt.id}</span>
          </div>

          <div className="receipt-footer">
            <p className="footer-greeting">Terima kasih atas kunjungan Anda!</p>
            <p className="footer-social">IG: @kopiresto.nusantara</p>
            <p className="footer-wifi">WiFi: RestoGuest / Password: kopienak123</p>
          </div>
        </div>

        {/* Finish button */}
        <div className="receipt-bottom-bar no-print">
          <button
            type="button"
            className="new-order-btn"
            onClick={() => setActiveReceipt(null)}
          >
            <Sparkles size={16} />
            <span>Selesai / Pesanan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
}
