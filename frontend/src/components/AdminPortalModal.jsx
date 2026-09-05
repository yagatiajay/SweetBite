import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Edit2, Trash2, Package, Upload, Check, AlertCircle, 
  Sparkles, DollarSign, Tag, Clock, Truck, Store, Mail, Send, 
  CheckCircle2, RefreshCw, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchProducts, fetchCategories, createProduct, updateProduct, 
  updateProductStock, deleteProduct, uploadProductImage, 
  fetchAllOrders, updateOrderStatus, sendTestEmailNotification 
} from '../services/api';
import confetti from 'canvas-confetti';

export default function AdminPortalModal() {
  const { isAdminModalOpen, setIsAdminModalOpen, user } = useAuth();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'settings'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Add / Edit Treat
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    price: '',
    discountPercent: '0',
    stockQuantity: '20',
    categoryId: 1,
    weightOrServings: '1 Portion (110g)',
    isVeg: true,
    isGlutenFree: false,
    isFeatured: false,
    imageUrl: '',
    flavourNotes: '',
    ingredients: '',
    allergens: 'Dairy, Gluten'
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [actionStatus, setActionStatus] = useState({ message: '', error: false });
  const [testEmailStatus, setTestEmailStatus] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, ords] = await Promise.all([
        fetchProducts({ category: 'all' }),
        fetchCategories(),
        fetchAllOrders()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminModalOpen) {
      loadData();
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  // Handle Image Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadProductImage(file);
      setFormData(prev => ({ ...prev, imageUrl: res.imageUrl }));
      setActionStatus({ message: 'Image uploaded successfully!', error: false });
    } catch (err) {
      setActionStatus({ message: err.message || 'Image upload failed', error: true });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      price: '',
      discountPercent: '0',
      stockQuantity: '20',
      categoryId: categories[0]?.id || 1,
      weightOrServings: '1 Portion (110g)',
      isVeg: true,
      isGlutenFree: false,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      flavourNotes: '',
      ingredients: '',
      allergens: 'Dairy, Gluten'
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      tagline: prod.tagline || '',
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
          width: '95%',
          maxHeight: '92vh',
          padding: '2rem',
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
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--color-cream-border)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-caramel-gold), var(--color-cocoa-primary))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem'
            }}>
              👑
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                Bakery Control Center
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)', margin: 0 }}>
                Full control over treats inventory, stock, promotional discounts, and live customer orders.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
            style={{
              padding: '0.4rem',
              color: 'var(--color-cocoa-muted)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Global Action feedback */}
        {actionStatus.message && (
          <div style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: actionStatus.error ? '#fee2e2' : '#dcfce7',
            color: actionStatus.error ? '#b91c1c' : '#15803d'
          }}>
            <span>{actionStatus.message}</span>
            <button onClick={() => setActionStatus({ message: '', error: false })}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--color-canvas)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.5rem',
          border: '1px solid var(--color-cream-border)'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('inventory'); setIsFormOpen(false); }}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'inventory' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: activeTab === 'inventory' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)'
            }}
          >
            🧁 Treats & Stock ({products.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('orders'); setIsFormOpen(false); }}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'orders' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: activeTab === 'orders' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)'
            }}
          >
            📋 Live Orders ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('settings'); setIsFormOpen(false); }}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'settings' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: activeTab === 'settings' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)'
            }}
          >
            📧 Notifications & Email
          </button>
        </div>

        {/* TAB 1: INVENTORY & PRODUCTS */}
        {activeTab === 'inventory' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* KPI Summary Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ backgroundColor: 'var(--color-canvas)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Treats</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-cocoa-dark)' }}>{products.length}</div>
              </div>
              <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '0.75rem', color: '#b45309', textTransform: 'uppercase', fontWeight: 700 }}>Low Stock (&le; 5)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#92400e' }}>{lowStockCount}</div>
              </div>
              <div style={{ backgroundColor: '#fee2e2', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '0.75rem', color: '#b91c1c', textTransform: 'uppercase', fontWeight: 700 }}>Sold Out</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b' }}>{soldOutCount}</div>
              </div>
              <div style={{ backgroundColor: '#ffe4e6', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3' }}>
                <div style={{ fontSize: '0.75rem', color: '#be123c', textTransform: 'uppercase', fontWeight: 700 }}>Discount Offers</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#9f1239' }}>{discountedCount}</div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                Bakery Menu Catalog
              </h3>
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                <span>Add New Treat</span>
              </button>
            </div>

            {/* Form Drawer / Accordion */}
            {isFormOpen && (
              <div style={{
                backgroundColor: 'var(--color-canvas)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1.5px solid var(--color-caramel-gold)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                    {editingId ? 'Edit Bakery Treat' : 'Add New Artisan Treat'}
                  </h4>
                  <button onClick={() => setIsFormOpen(false)} style={{ color: 'var(--color-cocoa-muted)' }}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Treat Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Belgian Triple Dark Brownie"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Category *
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price, Discount, Stock row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Base Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="4.50"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Discount Offer (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="90"
                        placeholder="0"
                        value={formData.discountPercent}
                        onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* Image Upload & URL */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Treat Photo (Upload from computer or paste Image URL) *
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        required
                        placeholder="https://... or /uploads/..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      />

                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.65rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-cocoa-primary)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        <Upload size={15} />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                        <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: 'none' }} />
                      </label>

                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Description & Notes */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Detailed Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Rich, dense cocoa crumb infused with bourbon vanilla..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Flavor Profile Notes
                      </label>
                      <input
                        type="text"
                        placeholder="Dark Cocoa • Sea Salt • Brown Butter"
                        value={formData.flavourNotes}
                        onChange={(e) => setFormData({ ...formData, flavourNotes: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                        Weight or Servings
                      </label>
                      <input
                        type="text"
                        placeholder="1 Square (110g) or 0.5 KG"
                        value={formData.weightOrServings}
                        onChange={(e) => setFormData({ ...formData, weightOrServings: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-cream-border)', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* Dietary checkboxes */}
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isVeg}
                        onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      />
                      <span>🌱 100% Eggless / Vegetarian</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isGlutenFree}
                        onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                      />
                      <span>Gluten-Free</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <span>⭐ Featured on Homepage</span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Check size={16} />
                      <span>{editingId ? 'Update Treat' : 'Publish Treat'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-cream-border)',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-canvas)', borderBottom: '1px solid var(--color-cream-border)', color: 'var(--color-cocoa-medium)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Treat</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Price & Discount</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Stock Count</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Availability</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const isSoldOut = prod.isSoldOut || prod.stockQuantity === 0;
                    return (
                      <tr key={prod.id} style={{ borderBottom: '1px solid rgba(92, 56, 36, 0.06)' }}>
                        <td style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-cocoa-dark)' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)' }}>{prod.weightOrServings}</div>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', color: 'var(--color-cocoa-medium)' }}>
                          {prod.category?.name || 'Artisan'}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-cocoa-dark)' }}>
                            ${prod.price.toFixed(2)}
                          </div>
                          {prod.discountPercent > 0 && (
                            <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-berry-soft)', color: 'var(--color-berry-rose)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                              {prod.discountPercent}% OFF
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <input
                            type="number"
                            min="0"
                            value={prod.stockQuantity}
                            onChange={(e) => handleStockCountChange(prod, e.target.value)}
                            style={{
                              width: '64px',
                              padding: '0.35rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-cream-border)',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              backgroundColor: prod.stockQuantity <= 5 ? '#fef3c7' : '#ffffff'
                            }}
                          />
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleSoldOut(prod)}
                            style={{
                              padding: '0.3rem 0.75rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: isSoldOut ? '#fee2e2' : '#dcfce7',
                              color: isSoldOut ? '#b91c1c' : '#15803d'
                            }}
                          >
                            {isSoldOut ? '🔴 Sold Out' : '🟢 In Stock'}
                          </button>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditForm(prod)}
                              style={{ padding: '0.35rem', color: 'var(--color-caramel-gold)', borderRadius: 'var(--radius-sm)' }}
                              title="Edit product"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id, prod.name)}
                              style={{ padding: '0.35rem', color: '#e11d48', borderRadius: 'var(--radius-sm)' }}
                              title="Delete product"
                            >
                              <Trash2 size={16} />
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

        {/* TAB 2: LIVE ORDERS & PIPELINE */}
        {activeTab === 'orders' && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                Customer Orders Queue
              </h3>
              <button onClick={loadData} className="btn btn-outline btn-sm">
                <RefreshCw size={14} />
                <span>Refresh Queue</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-cocoa-muted)' }}>
                No customer orders received yet.
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: 'var(--color-canvas)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    border: '1px solid var(--color-cream-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(92, 56, 36, 0.08)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-cocoa-dark)' }}>
                          {ord.orderReference}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)' }}>
                          {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--color-cocoa-medium)', marginTop: '2px' }}>
                        <strong>{ord.customerName}</strong> ({ord.customerEmail} • {ord.customerPhone})
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-cocoa-medium)' }}>
                        Oven Status:
                      </span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          backgroundColor: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Baking' ? '#ffe4e6' : '#fef3c7',
                          color: ord.status === 'Delivered' ? '#15803d' : ord.status === 'Baking' ? '#e11d48' : '#b45309',
                          border: '1px solid var(--color-cream-border)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Confirmed">✦ Confirmed & Scheduled</option>
                        <option value="Baking">🥣 Baking in Oven</option>
                        <option value="Ready">🚀 Ready for Pickup / En Route</option>
                        <option value="Delivered">✅ Delivered / Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Fulfillment and Notes */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--color-cocoa-medium)', marginBottom: '0.75rem' }}>
                    <div>
                      {ord.deliveryType === 'Pickup' ? '🏪 Bakery Pickup' : `🚚 Delivery to: ${ord.deliveryAddress}`} • Date: <strong>{ord.deliveryDate}</strong>
                      {ord.specialNotes && <span style={{ marginLeft: '8px', color: 'var(--color-caramel-gold)' }}>Note: "{ord.specialNotes}"</span>}
                    </div>
                    <div>
                      Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})
                    </div>
                  </div>

                  {/* Items summary */}
                  <div style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      {ord.items?.map((it, idx) => (
                        <span key={idx} style={{ color: 'var(--color-cocoa-dark)' }}>
                          <strong>{it.quantity}x</strong> {it.productName}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--color-cocoa-dark)' }}>
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
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{
              backgroundColor: 'var(--color-canvas)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              border: '1px solid var(--color-cream-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-berry-soft)',
                  color: 'var(--color-berry-rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                    Order Alert Email Notifications
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-cocoa-muted)', margin: 0 }}>
                    Whenever a customer places an order, an automated bakery receipt is dispatched immediately.
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-cream-border)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)', marginBottom: '0.25rem' }}>
                  Registered Bakery Owner Email:
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-caramel-gold)' }}>
                  yagatiajay2@gmail.com
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-tag-veg-text)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={14} />
                  <span>Configured & active in backend appsettings.json</span>
                </div>
              </div>

              {/* Test Email Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Send size={16} />
                  <span>Send Test Notification to yagatiajay2@gmail.com</span>
                </button>

                {testEmailStatus && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-cocoa-dark)', fontWeight: 600 }}>
                    {testEmailStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
