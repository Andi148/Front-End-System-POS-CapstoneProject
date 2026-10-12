import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_TRANSACTIONS } from '../data/initialData';

const PosContext = createContext();

export const PosProvider = ({ children }) => {
  // Products state (persisted to localStorage if available)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pos_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Navigation
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'products' | 'history' | 'reports'

  // POS State
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway'
  const [tableNumber, setTableNumber] = useState('01');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0); // nominal discount

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null); // Receipt transaction object

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Stok ${product.name} tidak mencukupi (sisa ${product.stock})`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock,
          quantity: 1,
          note: '',
        },
      ];
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart((prevCart) => {
      const target = prevCart.find((item) => item.id === productId);
      if (!target) return prevCart;

      const product = products.find((p) => p.id === productId);
      const newQty = target.quantity + delta;

      if (newQty <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }

      if (product && newQty > product.stock) {
        alert(`Maksimal stok tersedia adalah ${product.stock}`);
        return prevCart;
      }

      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartNote = (productId, note) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, note } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setDiscount(0);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1); // 10% PB1 / PPN
  const grandTotal = Math.max(0, subtotal + tax - discount);

  // Complete an order
  const completeTransaction = ({ paymentMethod, amountPaid, change }) => {
    const newTrx = {
      id: `TRX-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      cashier: 'Budi Santoso',
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : '',
      customerName: customerName || 'Pelanggan Umum',
      items: [...cart],
      subtotal,
      tax,
      discount,
      total: grandTotal,
      paymentMethod,
      amountPaid,
      change,
      status: 'completed',
    };

    // Deduct stock from products
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const cartItem = cart.find((c) => c.id === prod.id);
        if (cartItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartItem.quantity),
          };
        }
        return prod;
      })
    );

    // Save transaction
    setTransactions((prev) => [newTrx, ...prev]);

    // Show receipt
    setActiveReceipt(newTrx);
    setIsPaymentModalOpen(false);

    // Reset cart
    clearCart();

    return newTrx;
  };

  // Product CRUD
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: `PRD-${Date.now().toString().slice(-4)}`,
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Format currency helper
  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <PosContext.Provider
      value={{
        products,
        categories: INITIAL_CATEGORIES,
        transactions,
        activeTab,
        setActiveTab,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        updateCartNote,
        clearCart,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
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
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        activeReceipt,
        setActiveReceipt,
        completeTransaction,
        addProduct,
        updateProduct,
        deleteProduct,
        formatIDR,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
};
