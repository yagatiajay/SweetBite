import React, { useState, useEffect } from 'react';
import { Sparkles, Search, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { fetchCategories, fetchProducts } from '../services/api';

export default function TreatsCatalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts({
        category: activeCategory,
        search: searchQuery,
        isVeg: vegOnly
      });
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, [activeCategory, searchQuery, vegOnly]);

  return (
    <section id="treats" className="section" style={{ backgroundColor: 'var(--color-canvas)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Today's Fresh Bakes</span>
          </div>
          <h2 className="section-title">
            Signature Treats, <br />
            <span className="serif-italic">baked fresh daily.</span>
          </h2>
          <p className="section-subtitle">
            From warm fudgy brownies to buttery golden cookies and celebration cakes, explore our handcrafted artisanal selection.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* Top row: Category Tabs - Smooth horizontal scrolling */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'var(--transition-smooth)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                backgroundColor: activeCategory === 'all' ? 'var(--color-cocoa-primary)' : '#ffffff',
                color: activeCategory === 'all' ? '#ffffff' : 'var(--color-cocoa-medium)',
                boxShadow: activeCategory === 'all' ? 'var(--shadow-sm)' : 'none',
                border: `1.5px solid ${activeCategory === 'all' ? 'var(--color-cocoa-primary)' : 'var(--color-cream-border)'}`
              }}
            >
              All Treats
            </button>

            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'var(--transition-smooth)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    backgroundColor: isActive ? 'var(--color-cocoa-primary)' : '#ffffff',
                    color: isActive ? '#ffffff' : 'var(--color-cocoa-medium)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    border: `1.5px solid ${isActive ? 'var(--color-cocoa-primary)' : 'var(--color-cream-border)'}`
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Bottom row: Search input & Dietary filters */}
          <div className="treats-filter-bar">
            {/* Search Input */}
            <div className="treats-search-box">
              <Search size={18} color="var(--color-cocoa-muted)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search brownies, sea salt cookies, cakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.92rem',
                  backgroundColor: 'transparent'
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ color: 'var(--color-cocoa-muted)', flexShrink: 0 }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Veg filter toggle and count */}
            <div className="treats-filter-row-bottom" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setVegOnly(!vegOnly)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: vegOnly ? 'var(--color-tag-veg-bg)' : 'transparent',
                  color: vegOnly ? 'var(--color-tag-veg-text)' : 'var(--color-cocoa-light)',
                  border: `1px solid ${vegOnly ? '#a5d6a7' : 'var(--color-cream-border)'}`,
                  transition: 'var(--transition-smooth)',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>🌱 Eggless Only</span>
              </button>

              <span style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="treats-grid">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  height: '380px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-cream-border)',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }}
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="treats-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-cream-border)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍪</div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-cocoa-dark)', marginBottom: '0.5rem' }}>
              No treats match your criteria
            </h3>
            <p style={{ color: 'var(--color-cocoa-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Try clearing your search term or switching to "All Treats".
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setVegOnly(false);
              }}
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
