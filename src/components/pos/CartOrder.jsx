import { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  Utensils, 
  Package, 
  Tag, 
  ChevronRight,
  User,
  Coffee
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function CartOrder() {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    updateCartNote,
    clearCart,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    discount,
    setDiscount,
    subtotal,
    tax,
    grandTotal,
    setIsPaymentModalOpen,
    formatIDR,
  } = usePos();

  const [activeNoteItemId, setActiveNoteItemId] = useState(null);
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <aside className="pos-cart-panel">
      {/* Header Panel */}
      <div className="cart-header">
        <div className="cart-title-row">
          <div className="cart-title">
            <ShoppingBag size={20} className="cart-icon" />
            <h2>Daftar Pesanan</h2>
          </div>
          <span className="items-badge">{totalItemsCount} Item</span>
        </div>

        {/* Order Type Toggle */}
        <div className="order-type-toggle">
          <button
            type="button"
            className={`type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
            onClick={() => setOrderType('dine-in')}
          >
            <Utensils size={15} />
            <span>Makan di Tempat</span>
          </button>
          <button
            type="button"
            className={`type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
            onClick={() => setOrderType('takeaway')}
          >
            <Package size={15} />
            <span>Bawa Pulang</span>
          </button>
        </div>

        {/* Customer & Table details */}
        <div className="customer-info-inputs">
          {orderType === 'dine-in' && (
            <div className="input-group table-input-group">
              <label>No. Meja</label>
              <input
                type="text"
                placeholder="01"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                maxLength={4}
              />
            </div>
          )}
          <div className="input-group customer-input-group">
            <label>Nama Pelanggan (opsional)</label>
            <div className="input-with-icon">
              <User size={14} className="field-icon" />
              <input
                type="text"
                placeholder="cth: Kak Dian"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="cart-items-scroll">
        {cart.length === 0 ? (
          <div className="empty-cart-view">
            <div className="empty-icon-wrap">
              <Coffee size={36} />
            </div>
            <h4>Keranjang Masih Kosong</h4>
            <p>Pilih menu di sebelah kiri untuk menambahkan pesanan ke keranjang.</p>
          </div>
        ) : (
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-main">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                  
                  <div className="cart-item-details">
                    <span className="cart-item-title">{item.name}</span>
                    <span className="cart-item-unit-price">
                      {formatIDR(item.price)}
                    </span>

                    {/* Note button or note preview */}
                    {activeNoteItemId === item.id ? (
                      <div className="item-note-input-wrap">
                        <input
                          type="text"
                          placeholder="Catatan: cth. Less sugar / pedas"
                          value={item.note || ''}
                          onChange={(e) => updateCartNote(item.id, e.target.value)}
                          onBlur={() => setActiveNoteItemId(null)}
                          autoFocus
                          className="item-note-input"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="item-note-toggle"
                        onClick={() => setActiveNoteItemId(item.id)}
                      >
                        <FileText size={12} />
                        <span>{item.note ? item.note : '+ Catatan khusus'}</span>
                      </button>
                    )}
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQty(item.id, -1)}
                        title="Kurangi"
                      >
                        {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQty(item.id, 1)}
                        title="Tambah"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="item-total-price">
                      {formatIDR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary & Checkout */}
      {cart.length > 0 && (
        <div className="cart-footer">
          {/* Quick Discount Toggle */}
          <div className="discount-bar">
            {showDiscountInput ? (
              <div className="discount-input-group">
                <Tag size={15} />
                <input
                  type="number"
                  placeholder="Nominal diskon (Rp)"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  min={0}
                />
                <button
                  type="button"
                  className="close-discount-btn"
                  onClick={() => setShowDiscountInput(false)}
                >
                  Selesai
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="add-discount-btn"
                onClick={() => setShowDiscountInput(true)}
              >
                <Tag size={14} />
                <span>{discount > 0 ? `Diskon: -${formatIDR(discount)}` : '+ Tambah Diskon/Promo'}</span>
              </button>
            )}
          </div>

          <div className="summary-breakdown">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Pajak Resto (PB1 10%)</span>
              <span>{formatIDR(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-line discount-line">
                <span>Potongan Diskon</span>
                <span>-{formatIDR(discount)}</span>
              </div>
            )}
            <div className="summary-line total-line">
              <span>Total Bayar</span>
              <span className="total-highlight">{formatIDR(grandTotal)}</span>
            </div>
          </div>

          <div className="cart-bottom-actions">
            <button
              type="button"
              className="clear-cart-btn"
              onClick={clearCart}
              title="Batalkan Pesanan"
            >
              <Trash2 size={16} />
              <span>Batal</span>
            </button>
            <button
              type="button"
              className="checkout-pay-btn"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <span>Bayar {formatIDR(grandTotal)}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
