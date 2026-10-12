import { useState, useMemo } from 'react';
import { 
  X, 
  Banknote, 
  QrCode, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function PaymentModal() {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    grandTotal,
    completeTransaction,
    formatIDR,
  } = usePos();

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'qris' | 'debit' | 'transfer'
  const [cashGiven, setCashGiven] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  // Suggestion buttons for cash
  const quickCashOptions = useMemo(() => {
    const list = [grandTotal];
    const rounded50k = Math.ceil(grandTotal / 50000) * 50000;
    const rounded100k = Math.ceil(grandTotal / 100000) * 100000;
    
    if (rounded50k > grandTotal && !list.includes(rounded50k)) list.push(rounded50k);
    if (rounded100k > grandTotal && !list.includes(rounded100k)) list.push(rounded100k);
    if (!list.includes(50000) && grandTotal < 50000) list.push(50000);
    if (!list.includes(100000) && grandTotal < 100000) list.push(100000);
    if (!list.includes(200000) && grandTotal < 200000) list.push(200000);

    return [...new Set(list)].sort((a, b) => a - b);
  }, [grandTotal]);

  if (!isPaymentModalOpen) return null;

  const numericCash = paymentMethod === 'cash' ? Number(cashGiven) || 0 : grandTotal;
  const change = Math.max(0, numericCash - grandTotal);
  const isCashInsufficient = paymentMethod === 'cash' && numericCash < grandTotal;

  const handleFinishPayment = () => {
    if (isCashInsufficient) {
      alert('Nominal uang yang diterima kurang dari total tagihan!');
      return;
    }

    completeTransaction({
      paymentMethod,
      amountPaid: numericCash,
      change,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="payment-modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Pembayaran Pesanan</h3>
            <p className="modal-subtitle">Pilih metode pembayaran dan masukkan nominal</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Bill Total Banner */}
        <div className="bill-total-banner">
          <span className="banner-label">Total Tagihan</span>
          <span className="banner-amount">{formatIDR(grandTotal)}</span>
        </div>

        {/* Payment Methods Grid */}
        <div className="payment-methods-grid">
          <button
            type="button"
            className={`method-option-card ${paymentMethod === 'cash' ? 'active' : ''}`}
            onClick={() => {
              setPaymentMethod('cash');
              setCashGiven(String(grandTotal));
            }}
          >
            <Banknote size={24} className="method-icon" />
            <div className="method-text">
              <strong>Tunai / Cash</strong>
              <span>Uang kertas / koin</span>
            </div>
          </button>

          <button
            type="button"
            className={`method-option-card ${paymentMethod === 'qris' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('qris')}
          >
            <QrCode size={24} className="method-icon" />
            <div className="method-text">
              <strong>QRIS Instant</strong>
              <span>BCA, GoPay, OVO, Dana</span>
            </div>
          </button>

          <button
            type="button"
            className={`method-option-card ${paymentMethod === 'debit' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('debit')}
          >
            <CreditCard size={24} className="method-icon" />
            <div className="method-text">
              <strong>Debit / Kartu</strong>
              <span>Mesin EDC Kasir</span>
            </div>
          </button>

          <button
            type="button"
            className={`method-option-card ${paymentMethod === 'transfer' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('transfer')}
          >
            <Building2 size={24} className="method-icon" />
            <div className="method-text">
              <strong>Transfer Bank</strong>
              <span>BCA / Mandiri / BRI</span>
            </div>
          </button>
        </div>

        {/* Payment Details Body */}
        <div className="payment-method-details-box">
          {paymentMethod === 'cash' && (
            <div className="cash-payment-form">
              <label className="field-label">Uang Tunai Diterima:</label>
              
              <div className="quick-cash-chips">
                {quickCashOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`cash-chip ${numericCash === opt ? 'chip-active' : ''}`}
                    onClick={() => setCashGiven(String(opt))}
                  >
                    {opt === grandTotal ? 'Uang Pas' : formatIDR(opt)}
                  </button>
                ))}
              </div>

              <div className="input-rupiah-group">
                <span className="currency-prefix">Rp</span>
                <input
                  type="number"
                  placeholder="0"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="cash-input"
                  autoFocus
                />
              </div>

              {/* Kembalian / Selisih alert */}
              <div className={`change-display-box ${isCashInsufficient ? 'insufficient' : 'sufficient'}`}>
                {isCashInsufficient ? (
                  <>
                    <AlertCircle size={20} className="change-icon warning" />
                    <div>
                      <span className="change-title">Uang Masih Kurang</span>
                      <strong className="change-amount negative">
                        {formatIDR(grandTotal - numericCash)}
                      </strong>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} className="change-icon success" />
                    <div>
                      <span className="change-title">Kembalian Pelanggan</span>
                      <strong className="change-amount positive">
                        {formatIDR(change)}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {paymentMethod === 'qris' && (
            <div className="qris-payment-view">
              <div className="qris-card-inner">
                <div className="qris-header">
                  <span className="qris-logo-mock">QRIS INDONESIA</span>
                  <span className="qris-partner">NMID: ID102026889901</span>
                </div>
                
                {/* Simulated dynamic QR code pattern */}
                <div className="qris-qr-wrapper">
                  <svg viewBox="0 0 100 100" className="mock-qr-svg">
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Corners */}
                    <rect x="10" y="10" width="24" height="24" fill="#1e293b" />
                    <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                    <rect x="18" y="18" width="8" height="8" fill="#1e293b" />

                    <rect x="66" y="10" width="24" height="24" fill="#1e293b" />
                    <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                    <rect x="74" y="18" width="8" height="8" fill="#1e293b" />

                    <rect x="10" y="66" width="24" height="24" fill="#1e293b" />
                    <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                    <rect x="18" y="74" width="8" height="8" fill="#1e293b" />

                    {/* Inner mock pattern bits */}
                    <rect x="42" y="14" width="6" height="14" fill="#1e293b" />
                    <rect x="52" y="22" width="8" height="6" fill="#1e293b" />
                    <rect x="40" y="40" width="20" height="20" fill="#0f766e" rx="4" />
                    <rect x="12" y="44" width="20" height="8" fill="#1e293b" />
                    <rect x="68" y="44" width="20" height="8" fill="#1e293b" />
                    <rect x="42" y="68" width="16" height="18" fill="#1e293b" />
                    <rect x="66" y="70" width="22" height="14" fill="#1e293b" />
                  </svg>
                  <div className="qr-badge">SCAN ME</div>
                </div>

                <div className="qris-instruction">
                  <p>Arahkan kamera aplikasi e-wallet / m-Banking pelanggan ke QR Code.</p>
                  <span className="qris-validity">
                    <Sparkles size={14} /> Terverifikasi Realtime
                  </span>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'debit' && (
            <div className="debit-payment-view">
              <label className="field-label">Nomor Referensi / Trace EDC (Opsional):</label>
              <input
                type="text"
                placeholder="cth: REF-9823412"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="trace-input"
              />
              <p className="edc-note">
                Pastikan transaksi di mesin EDC (BCA/Mandiri/BRI) telah berstatus <strong>SUCCESS / APPROVED</strong> sebelum menyelesaikan pesanan.
              </p>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="transfer-payment-view">
              <p className="transfer-title">Rekening Resto & Coffee:</p>
              <div className="bank-card">
                <span className="bank-name">Bank Central Asia (BCA)</span>
                <span className="bank-account">8830-192-881</span>
                <span className="bank-holder">a.n. PT Kopi Nusantara Sukses</span>
              </div>
              <p className="edc-note">Periksa mutasi rekening sebelum menyelesaikan pesanan.</p>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="modal-actions-row">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="modal-confirm-pay-btn"
            disabled={isCashInsufficient}
            onClick={handleFinishPayment}
          >
            <CheckCircle2 size={18} />
            <span>Selesaikan & Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
