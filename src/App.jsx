import { PosProvider, usePos } from './context/PosContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProductCatalog from './components/pos/ProductCatalog';
import CartOrder from './components/pos/CartOrder';
import PaymentModal from './components/pos/PaymentModal';
import ReceiptModal from './components/pos/ReceiptModal';
import ProductManagement from './components/products/ProductManagement';
import TransactionHistory from './components/history/TransactionHistory';
import SimpleReports from './components/reports/SimpleReports';

function PosMainContent() {
  const { activeTab } = usePos();

  return (
    <div className="pos-app-layout">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Body */}
      <div className="pos-main-container">
        <Navbar />

        <main className="pos-content-area">
          {activeTab === 'pos' && (
            <div className="pos-cashier-screen">
              <ProductCatalog />
              <CartOrder />
            </div>
          )}

          {activeTab === 'products' && <ProductManagement />}

          {activeTab === 'history' && <TransactionHistory />}

          {activeTab === 'reports' && <SimpleReports />}
        </main>
      </div>

      {/* Global Modals */}
      <PaymentModal />
      <ReceiptModal />
    </div>
  );
}

export default function App() {
  return (
    <PosProvider>
      <PosMainContent />
    </PosProvider>
  );
}
