import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Check, AlertTriangle, ShieldCheck, Mail, Send, DollarSign, Tag, CheckCircle2, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  fetchAllOrders,
  updateOrderStatus,
  sendTestEmailNotification,
  uploadProductImage
} from '../services/api';
import confetti from 'canvas-confetti';

export default function AdminPortalModal() {
  const { isAdminModalOpen, setIsAdminModalOpen, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'settings'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Product Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercent: '0',
    stockQuantity: '20',
    categoryId: 1,
    weightOrServings: '1 Portion',
    isVeg: true,
    isGlutenFree: false,
    isFeatured: false,
    imageUrl: '',
    flavourNotes: '',
    ingredients: '',
    allergens: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [actionStatus, setActionStatus] = useState({ message: '', error: false });
  const [testEmailStatus, setTestEmailStatus] = useState('');

  useEffect(() => {
    if (isAdminModalOpen) {
      loadData();
    }
  }, [isAdminModalOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData, ordsData] = await Promise.all([
        fetchProducts({ category: 'all' }),
        fetchCategories(),
        fetchAllOrders()
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setOrders(ordsData);
      if (catsData.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catsData[0].id }));
      }
    } catch (err) {
      console.error(err);
      setActionStatus({ message: 'Error loading admin data', error: true });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdminModalOpen || !isAdmin) return null;

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPercent: '0',
      stockQuantity: '20',
      categoryId: categories[0]?.id || 1,
      weightOrServings: '1 Portion',
      isVeg: true,
      isGlutenFree: false,
      isFeatured: false,
      imageUrl: '',
      flavourNotes: '',
      ingredients: '',
      allergens: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.originalPrice || prod.price,
      discountPercent: prod.discountPercent?.toString() || '0',
      stockQuantity: prod.stockQuantity?.toString() || '20',
      categoryId: prod.categoryId || categories[0]?.id || 1,
      weightOrServings: prod.weightOrServings || '1 Portion',
      isVeg: prod.isVeg,
      isGlutenFree: prod.isGlutenFree,
      isFeatured: prod.isFeatured,
      imageUrl: prod.imageUrl || '',
      flavourNotes: prod.flavourNotes || '',
      ingredients: prod.ingredients || '',
      allergens: prod.allergens || ''
    });
    setIsFormOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      setActionStatus({ message: 'Product image uploaded successfully!', error: false });
    } catch (err) {
      setActionStatus({ message: 'Failed to upload image', error: true });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPercent: parseFloat(formData.discountPercent) || 0,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        categoryId: parseInt(formData.categoryId, 10)
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        setActionStatus({ message: `Treat "${formData.name}" updated successfully!`, error: false });
      } else {
        await createProduct(payload);
        setActionStatus({ message: `New treat "${formData.name}" added to menu!`, error: false });
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }

      setIsFormOpen(false);
      await loadData();
    } catch (err) {
      setActionStatus({ message: err.message || 'Failed to save product', error: true });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the bakery menu?`)) return;
    try {
      await deleteProduct(id);
      setActionStatus({ message: `"${name}" removed.`, error: false });
      await loadData();
    } catch (err) {
      setActionStatus({ message: err.message || 'Failed to delete product', error: true });
    }
  };

  const handleToggleSoldOut = async (prod) => {
    try {
      const newSoldOut = !prod.isSoldOut;
      const newStock = newSoldOut ? 0 : 20;
      await updateProductStock(prod.id, { stockQuantity: newStock, isSoldOut: newSoldOut });
      await loadData();
    } catch (err) {
      alert('Could not update stock status');
    }
  };

  const handleStockCountChange = async (prod, newCount) => {
    const qty = Math.max(0, parseInt(newCount, 10) || 0);
    try {
      await updateProductStock(prod.id, { stockQuantity: qty, isSoldOut: qty <= 0 });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadData();
    } catch (err) {
      alert('Could not update order status');
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailStatus('Sending test notification email to yagatiajay2@gmail.com...');
    try {
      const res = await sendTestEmailNotification('yagatiajay2@gmail.com');
      setTestEmailStatus(`✅ ${res.message}`);
    } catch (err) {
      setTestEmailStatus(`⚠️ ${err.message}`);
    }
  };

  const lowStockCount = products.filter(p => !p.isSoldOut && p.stockQuantity > 0 && p.stockQuantity <= 5).length;
  const soldOutCount = products.filter(p => p.isSoldOut || p.stockQuantity === 0).length;
  const discountedCount = products.filter(p => p.discountPercent > 0).length;

  return (
    <div className="modal-overlay" onClick={() => setIsAdminModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1080px',
          width: 'min(96vw, 1080px)',
          maxHeight: '92vh',
          padding: 'clamp(1rem, 3vw, 1.75rem)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-cream-border)',
          marginBottom: '1rem',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-caramel-gold), var(--color-cocoa-primary))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0
            }}>
              👑
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                Bakery Control Center
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Inventory, stock, promotional discounts, and live customer orders.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAdminModalOpen(false)}
            style={{
              padding: '0.4rem',
              color: 'var(--color-cocoa-muted)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Global Action feedback */}
        {actionStatus.message && (
          <div style={{
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '0.85rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: actionStatus.error ? '#fee2e2' : '#dcfce7',
            color: actionStatus.error ? '#b91c1c' : '#15803d'
          }}>
            <span>{actionStatus.message}</span>
            <button type="button" onClick={() => setActionStatus({ message: '', error: false })}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            onClick={() => { setActiveTab('inventory'); setIsFormOpen(false); }}
            style={{
              flex: 1,
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'inventory' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: activeTab === 'inventory' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap'
            }}
          >
            🧁 Treats & Stock ({products.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('orders'); setIsFormOpen(false); }}
            style={{
              flex: 1,
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'orders' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: activeTab === 'orders' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap'
            }}
          >
            📋 Live Orders ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('settings'); setIsFormOpen(false); }}
            style={{
              flex: 1,
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'settings' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: activeTab === 'settings' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap'
            }}
          >
            📧 Notifications & Email
          </button>
        </div>

        {/* TAB 1: INVENTORY & PRODUCTS */}
        {activeTab === 'inventory' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* KPI Summary Bar */}
            <div className="admin-stats-grid">
              <div style={{ backgroundColor: 'var(--color-canvas)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-cocoa-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Treats</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-cocoa-dark)' }}>{products.length}</div>
              </div>
              <div style={{ backgroundColor: '#fef3c7', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '0.72rem', color: '#b45309', textTransform: 'uppercase', fontWeight: 700 }}>Low Stock (&le; 5)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#92400e' }}>{lowStockCount}</div>
              </div>
              <div style={{ backgroundColor: '#fee2e2', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '0.72rem', color: '#b91c1c', textTransform: 'uppercase', fontWeight: 700 }}>Sold Out</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#991b1b' }}>{soldOutCount}</div>
              </div>
              <div style={{ backgroundColor: '#ffedd5', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #fed7aa' }}>
                <div style={{ fontSize: '0.72rem', color: '#c2410c', textTransform: 'uppercase', fontWeight: 700 }}>On Sale</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#9a3412' }}>{discountedCount}</div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                Bakery Menu Catalog
              </h3>
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} />
                <span>Add New Treat</span>
              </button>
            </div>

            {/* Form Drawer / Accordion */}
            {isFormOpen && (
              <div style={{
                backgroundColor: 'var(--color-canvas)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                border: '1.5px solid var(--color-caramel-gold)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                    {editingId ? 'Edit Bakery Treat' : 'Add New Artisan Treat'}
                  </h4>
                  <button type="button" onClick={() => setIsFormOpen(false)} style={{ color: 'var(--color-cocoa-muted)' }}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Treat Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Belgian Triple Dark Brownie"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Category *
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price, Discount, Stock row */}
                  <div className="admin-form-pricing-grid">
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Base Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="4.50"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Discount Offer (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="90"
                        placeholder="0"
                        value={formData.discountPercent}
                        onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Image Upload & URL */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Treat Photo (Upload file or paste URL) *
                    </label>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        required
                        placeholder="https://... or /uploads/..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        style={{ flex: 1, minWidth: '180px', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                      />

                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.6rem 0.9rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-cocoa-primary)',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}>
                        <Upload size={14} />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                        <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: 'none' }} />
                      </label>

                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Description & Notes */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Detailed Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Rich, dense cocoa crumb infused with bourbon vanilla..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Flavor Profile Notes
                      </label>
                      <input
                        type="text"
                        placeholder="Dark Cocoa • Sea Salt"
                        value={formData.flavourNotes}
                        onChange={(e) => setFormData({ ...formData, flavourNotes: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Weight or Servings
                      </label>
                      <input
                        type="text"
                        placeholder="1 Square (110g) or 0.5 KG"
                        value={formData.weightOrServings}
                        onChange={(e) => setFormData({ ...formData, weightOrServings: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Dietary checkboxes */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isVeg}
                        onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      />
                      <span>🌱 Eggless / Vegetarian</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isGlutenFree}
                        onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                      />
                      <span>Gluten-Free</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <span>⭐ Featured</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.4rem' }}>
                    <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Check size={15} />
                      <span>{editingId ? 'Update Treat' : 'Publish Treat'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table with touch-friendly scroll container */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-cream-border)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-canvas)', borderBottom: '1px solid var(--color-cream-border)', color: 'var(--color-cocoa-medium)' }}>
                    <th style={{ padding: '0.75rem 0.95rem' }}>Treat</th>
                    <th style={{ padding: '0.75rem 0.95rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 0.95rem' }}>Price & Discount</th>
                    <th style={{ padding: '0.75rem 0.95rem' }}>Stock Count</th>
                    <th style={{ padding: '0.75rem 0.95rem' }}>Availability</th>
                    <th style={{ padding: '0.75rem 0.95rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const isSoldOut = prod.isSoldOut || prod.stockQuantity === 0;
                    return (
                      <tr key={prod.id} style={{ borderBottom: '1px solid rgba(92, 56, 36, 0.06)' }}>
                        <td style={{ padding: '0.75rem 0.95rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-cocoa-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                              {prod.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-cocoa-muted)' }}>{prod.weightOrServings}</div>
                          </div>
                        </td>

                        <td style={{ padding: '0.75rem 0.95rem', color: 'var(--color-cocoa-medium)' }}>
                          {prod.category?.name || 'Artisan'}
                        </td>

                        <td style={{ padding: '0.75rem 0.95rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-cocoa-dark)' }}>
                            ${prod.price.toFixed(2)}
                          </div>
                          {prod.discountPercent > 0 && (
                            <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--color-offer-soft)', color: 'var(--color-offer-bg)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                              {prod.discountPercent}% OFF
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '0.75rem 0.95rem' }}>
                          <input
                            type="number"
                            min="0"
                            value={prod.stockQuantity}
                            onChange={(e) => handleStockCountChange(prod, e.target.value)}
                            style={{
                              width: '60px',
                              padding: '0.25rem 0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-cream-border)',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              textAlign: 'center'
                            }}
                          />
                        </td>

                        <td style={{ padding: '0.75rem 0.95rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleSoldOut(prod)}
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: isSoldOut ? '#fee2e2' : '#dcfce7',
                              color: isSoldOut ? '#b91c1c' : '#15803d',
                              border: `1px solid ${isSoldOut ? '#fecaca' : '#bbf7d0'}`,
                              cursor: 'pointer'
                            }}
                          >
                            {isSoldOut ? '🔴 Sold Out' : '🟢 In Stock'}
                          </button>
                        </td>

                        <td style={{ padding: '0.75rem 0.95rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(prod)}
                              style={{
                                padding: '0.35rem',
                                color: 'var(--color-cocoa-dark)',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(92, 56, 36, 0.05)'
                              }}
                              title="Edit product"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(prod.id, prod.name)}
                              style={{
                                padding: '0.35rem',
                                color: '#e11d48',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: '#fff1f2'
                              }}
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--color-cocoa-muted)' }}>
                No customer orders received yet.
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: 'var(--color-canvas)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    border: '1px solid var(--color-cream-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '0.65rem',
                    paddingBottom: '0.65rem',
                    borderBottom: '1px solid rgba(92, 56, 36, 0.08)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-cocoa-dark)' }}>
                          {ord.orderReference}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)' }}>
                          {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-medium)', marginTop: '2px' }}>
                        <strong>{ord.customerName}</strong> ({ord.customerEmail} • {ord.customerPhone})
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-cocoa-medium)' }}>
                        Status:
                      </span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Baking' ? '#ffe4e6' : '#fef3c7',
                          color: ord.status === 'Delivered' ? '#15803d' : ord.status === 'Baking' ? '#e11d48' : '#b45309',
                          border: '1px solid var(--color-cream-border)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Confirmed">✦ Confirmed</option>
                        <option value="Baking">🥣 Baking</option>
                        <option value="Ready">🚀 Ready / En Route</option>
                        <option value="Delivered">✅ Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Fulfillment and Notes */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--color-cocoa-medium)', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      {ord.deliveryType === 'Pickup' ? '🏪 Bakery Pickup' : `🚚 Delivery: ${ord.deliveryAddress}`} • Date: <strong>{ord.deliveryDate}</strong>
                      {ord.specialNotes && <span style={{ marginLeft: '6px', color: 'var(--color-caramel-gold)' }}>Note: "{ord.specialNotes}"</span>}
                    </div>
                    <div>
                      Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})
                    </div>
                  </div>

                  {/* Items summary */}
                  <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                      {ord.items?.map((it, idx) => (
                        <span key={idx} style={{ color: 'var(--color-cocoa-dark)' }}>
                          <strong>{it.quantity}x</strong> {it.productName}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--color-cocoa-dark)' }}>
                      ${ord.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS & EMAIL */}
        {activeTab === 'settings' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'var(--color-canvas)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1rem, 3vw, 1.75rem)',
              border: '1px solid var(--color-cream-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-caramel-soft)',
                  color: 'var(--color-caramel-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                    Order Alert Email Notifications
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)', margin: 0 }}>
                    Whenever a customer places an order, an automated bakery receipt is dispatched immediately.
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-cream-border)',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-muted)', marginBottom: '0.2rem' }}>
                  Registered Bakery Owner Email:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-caramel-gold)' }}>
                  yagatiajay2@gmail.com
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-tag-veg-text)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={13} />
                  <span>Configured & active in backend appsettings.json</span>
                </div>
              </div>

              {/* Test Email Button & Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'flex-start' }}>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.6rem',
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Send size={16} />
                  <span>Send Test Email Notification</span>
                </button>

                {testEmailStatus && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: testEmailStatus.includes('✅') ? '#edf7ee' : '#fef3c7',
                    color: testEmailStatus.includes('✅') ? '#1e4620' : '#854d0e',
                    border: `1px solid ${testEmailStatus.includes('✅') ? '#bbf7d0' : '#fde68a'}`,
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>{testEmailStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-tabs-nav {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background-color: var(--color-canvas);
          padding: 0.3rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.25rem;
          border: 1px solid var(--color-cream-border);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.85rem;
        }
        .admin-form-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }
        @media (max-width: 768px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .admin-form-pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 540px) {
          .admin-tabs-nav {
            flex-direction: column;
            border-radius: var(--radius-lg);
          }
          .admin-tabs-nav button {
            width: 100%;
          }
          .admin-stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
          }
          .admin-form-pricing-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
