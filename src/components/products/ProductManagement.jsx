import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Package, 
  AlertTriangle 
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function ProductManagement() {
  const { products, categories, addProduct, updateProduct, deleteProduct, formatIDR } = usePos();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'kopi',
    price: '',
    stock: '',
    sku: '',
    description: '',
    image: '',
  });

  const filteredProducts = products.filter((p) => {
    const matchesCat = filterCat === 'all' || p.category === filterCat;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'kopi',
      price: '',
      stock: '',
      sku: `MENU-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku || '',
      description: product.description || '',
      image: product.image || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Nama menu dan harga wajib diisi!');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...payload });
    } else {
      addProduct(payload);
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus menu "${name}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="management-view">
      {/* Header bar */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Kelola Daftar Menu & Stok</h1>
          <p className="view-subtitle">Tambah menu baru, ubah harga, atau pantau sisa stok bahan</p>
        </div>
        <button
          type="button"
          className="primary-action-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter and search toolbar */}
      <div className="management-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Cari nama menu atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select-box">
          <label>Kategori:</label>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-card">
        <table className="management-table">
          <thead>
            <tr>
              <th>Foto & Nama Menu</th>
              <th>SKU</th>
              <th>Kategori</th>
              <th>Harga Jual</th>
              <th>Stok Tersedia</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  Tidak ada menu yang sesuai kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 15;
                const catObj = categories.find((c) => c.id === p.category);

                return (
                  <tr key={p.id}>
                    <td>
                      <div className="product-table-cell">
                        <img src={p.image} alt={p.name} className="table-thumb" />
                        <div>
                          <strong className="cell-name">{p.name}</strong>
                          <span className="cell-desc">{p.description}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sku-badge">{p.sku || '-'}</span>
                    </td>
                    <td>
                      <span className="category-tag">{catObj?.name || p.category}</span>
                    </td>
                    <td>
                      <strong className="price-tag">{formatIDR(p.price)}</strong>
                    </td>
                    <td>
                      <span className="stock-number">{p.stock} porsi</span>
                    </td>
                    <td>
                      {isOutOfStock ? (
                        <span className="status-pill status-out">Habis</span>
                      ) : isLowStock ? (
                        <span className="status-pill status-low">Menipis</span>
                      ) : (
                        <span className="status-pill status-ready">Tersedia</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="icon-action-btn edit"
                          onClick={() => openEditModal(p)}
                          title="Edit Menu"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-action-btn delete"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Hapus Menu"
                        >
                          <Trash2 size={15} />
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

      {/* Modal Add / Edit Product */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="product-form-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Edit Data Menu' : 'Tambah Menu Baru'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nama Menu *</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: Kopi Susu Pandan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Kode SKU / Barcode</label>
                  <input
                    type="text"
                    placeholder="cth: CF-005"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="25000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Stok Awal</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>URL Gambar Menu</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Deskripsi Singkat / Bahan</label>
                  <textarea
                    rows={2}
                    placeholder="Kombinasi espresso arabika, susu oat, dan ekstrak pandan segar..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="modal-confirm-pay-btn">
                  <Check size={18} />
                  <span>{editingProduct ? 'Simpan Perubahan' : 'Tambah Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
