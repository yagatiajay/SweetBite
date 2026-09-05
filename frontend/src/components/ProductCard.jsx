import React, { useState } from 'react';
import { Plus, Check, Star, Eye, Tag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isSoldOut = product.isSoldOut || product.stockQuantity <= 0;
  const isLowStock = !isSoldOut && product.stockQuantity > 0 && product.stockQuantity <= 5;
  const hasDiscount = product.discountPercent > 0 && product.originalPrice;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => setQuickViewProduct(product)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-cream-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'var(--transition-bounce)',
        cursor: 'pointer',
        position: 'relative',
        opacity: isSoldOut ? 0.85 : 1
      }}
      onMouseEnter={(e) => {
        if (!isSoldOut) {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--color-cream-border-hover)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--color-cream-border)';
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f9f3f0' }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            filter: isSoldOut ? 'grayscale(40%) contrast(90%)' : 'none'
          }}
          onMouseEnter={(e) => !isSoldOut && (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => !isSoldOut && (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Sold Out Watermark / Overlay */}
        {isSoldOut && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(42, 24, 16, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)'
          }}>
            <span style={{
              backgroundColor: '#1f130c',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Sold Out for Today
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          right: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {product.category && (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--color-cocoa-medium)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                {product.category.name}
              </span>
            )}

            {hasDiscount && (
              <span style={{
                backgroundColor: 'var(--color-offer-bg)',
                color: '#ffffff',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: '0 2px 8px rgba(194, 65, 12, 0.3)'
              }}>
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {product.isVeg && (
            <span className="badge-veg" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              🌱 Eggless
            </span>
          )}
        </div>

        {/* Quick View Hover Pill */}
        {!isSoldOut && (
          <div
            style={{
              position: 'absolute',
              bottom: '0.85rem',
              right: '0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-cocoa-primary)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'var(--transition-smooth)'
            }}
            title="Quick view ingredients"
          >
            <Eye size={16} />
          </div>
        )}
      </div>

      {/* Details Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Rating & Stock Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-caramel-gold)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Star size={13} fill="currentColor" />
            <span>{product.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-cocoa-muted)', fontWeight: 400 }}>({product.reviewCount})</span>
          </div>

          {isLowStock ? (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#d97706',
              backgroundColor: '#fef3c7',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Only {product.stockQuantity} left!
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', fontWeight: 500 }}>
              {product.weightOrServings}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 style={{
          fontSize: '1.2rem',
          color: 'var(--color-cocoa-dark)',
          marginBottom: '0.4rem',
          lineHeight: 1.25
        }}>
          {product.name}
        </h3>

        {/* Tagline / Flavour Notes */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-cocoa-light)',
          lineHeight: 1.45,
          marginBottom: '1rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.flavourNotes || product.description}
        </p>

        {/* Price & Add to Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(92, 56, 36, 0.08)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-cocoa-dark)'
              }}>
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-cocoa-muted)',
                  textDecoration: 'line-through'
                }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-cocoa-muted)' }}>
              {isSoldOut ? 'Restocking soon' : `${product.stockQuantity} available`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isSoldOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: isSoldOut
                ? '#e5e7eb'
                : justAdded
                ? 'var(--color-caramel-gold)'
                : 'var(--color-cocoa-primary)',
              color: isSoldOut ? '#9ca3af' : '#ffffff',
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: isSoldOut ? 'not-allowed' : 'pointer',
              transition: 'var(--transition-bounce)'
            }}
          >
            {isSoldOut ? (
              <span>Sold Out</span>
            ) : justAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
