import { 
  Search, 
  Utensils, 
  Coffee, 
  CupSoda, 
  Soup, 
  Cookie, 
  Cake, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

const categoryIconMap = {
  Utensils,
  Coffee,
  CupSoda,
  Soup,
  Cookie,
  Cake,
};

export default function ProductCatalog() {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addToCart,
    formatIDR,
  } = usePos();

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="product-catalog-section">
      {/* Top Header Bar with Search & Live clock */}
      <div className="catalog-header">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Cari menu, kopi, makanan, atau SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="catalog-summary">
          <span>Menampilkan <strong>{filteredProducts.length}</strong> menu</span>
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="category-scroll-container">
        {categories.map((cat) => {
          const Icon = categoryIconMap[cat.icon] || Utensils;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-pill ${isSelected ? 'active' : ''}`}
            >
              <Icon size={16} className="category-icon" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-catalog-state">
            <AlertCircle size={40} className="empty-icon" />
            <p className="empty-title">Menu tidak ditemukan</p>
            <p className="empty-desc">
              Coba ganti kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 15;

            return (
              <div
                key={product.id}
                className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
                onClick={() => !isOutOfStock && addToCart(product)}
              >
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                  <span className="product-sku-tag">{product.sku || 'F&B'}</span>
                  {isOutOfStock ? (
                    <div className="stock-overlay out">Habis</div>
                  ) : isLowStock ? (
                    <div className="stock-overlay low">Sisa {product.stock}</div>
                  ) : null}
                </div>

                <div className="product-card-body">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>

                  <div className="product-card-footer">
                    <span className="product-price">
                      {formatIDR(product.price)}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      className="add-to-cart-btn"
                      title="Tambah ke Pesanan"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
