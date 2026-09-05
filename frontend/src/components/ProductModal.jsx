import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Star, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isSoldOut = quickViewProduct.isSoldOut || quickViewProduct.stockQuantity <= 0;
  const isLowStock = !isSoldOut && quickViewProduct.stockQuantity > 0 && quickViewProduct.stockQuantity <= 5;
  const hasDiscount = quickViewProduct.discountPercent > 0 && quickViewProduct.originalPrice;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
      <div
        className="modal-content product-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cocoa-dark)',
            boxShadow: 'var(--shadow-sm)'
          }}
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Image */}
          <div className="product-modal-image-col">
            <img
              src={quickViewProduct.imageUrl}
              alt={quickViewProduct.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isSoldOut ? 'grayscale(40%)' : 'none'
              }}
            />

            {isSoldOut && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(42, 24, 16, 0.5)',
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
                  padding: '0.45rem 1.1rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Sold Out for Today
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="product-modal-details-col">
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {quickViewProduct.category && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-cocoa-light)',
                  letterSpacing: '0.05em'
                }}>
                  {quickViewProduct.category.name}
                </span>
              )}

              {hasDiscount && (
                <span style={{
                  backgroundColor: 'var(--color-berry-rose)',
                  color: '#ffffff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {quickViewProduct.discountPercent}% OFF
                </span>
              )}

              {quickViewProduct.isVeg && (
                <span className="badge-veg">🌱 100% Eggless</span>
              )}

              {isLowStock && (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#d97706',
                  backgroundColor: '#fef3c7',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Only {quickViewProduct.stockQuantity} left!
                </span>
              )}
            </div>

            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
              color: 'var(--color-cocoa-dark)',
              marginBottom: '0.35rem',
              lineHeight: 1.2
            }}>
              {quickViewProduct.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-caramel-gold)' }}>
                <Star size={15} fill="currentColor" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-cocoa-dark)' }}>
                  {quickViewProduct.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)' }}>
                  ({quickViewProduct.reviewCount} reviews)
                </span>
              </div>

              <span style={{ color: 'var(--color-cocoa-muted)' }}>•</span>

              <span style={{ fontSize: '0.85rem', color: 'var(--color-cocoa-medium)', fontWeight: 500 }}>
                {quickViewProduct.weightOrServings}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.92rem',
              color: 'var(--color-cocoa-medium)',
              lineHeight: 1.6,
              marginBottom: '1rem'
            }}>
              {quickViewProduct.description}
            </p>

            {/* Flavour notes */}
            {quickViewProduct.flavourNotes && (
              <div style={{
                backgroundColor: 'var(--color-canvas-subtle)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--color-cream-border)'
              }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-caramel-gold)',
                  marginBottom: '0.15rem',
                  letterSpacing: '0.04em'
                }}>
                  Flavor Profile
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-cocoa-dark)' }}>
                  {quickViewProduct.flavourNotes}
                </div>
              </div>
            )}

            {/* Ingredients & Allergens */}
            <div style={{ marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--color-cocoa-light)', flex: 1 }}>
              <div style={{ marginBottom: '0.35rem' }}>
                <strong style={{ color: 'var(--color-cocoa-dark)' }}>Ingredients: </strong>
                {quickViewProduct.ingredients || 'Hand-selected organic flour, pure butter, cane sugar, fine chocolate.'}
              </div>
              {quickViewProduct.allergens && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b45309', fontSize: '0.78rem' }}>
                  <AlertCircle size={14} />
                  <span>Contains: {quickViewProduct.allergens}</span>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="product-modal-footer">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', display: 'block' }}>Total</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-cocoa-dark)'
                  }}>
                    ${(quickViewProduct.price * quantity).toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-cocoa-muted)',
                      textDecoration: 'line-through'
                    }}>
                      ${(quickViewProduct.originalPrice * quantity).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              {!isSoldOut && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-canvas-subtle)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-cream-border)',
                  padding: '0.2rem 0.4rem'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.35rem', color: 'var(--color-cocoa-dark)' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quickViewProduct.stockQuantity, quantity + 1))}
                    style={{ padding: '0.35rem', color: 'var(--color-cocoa-dark)' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className="btn btn-primary"
                style={{
                  padding: '0.7rem 1.25rem',
                  backgroundColor: isSoldOut ? '#e5e7eb' : 'var(--color-cocoa-primary)',
                  color: isSoldOut ? '#9ca3af' : '#ffffff',
                  cursor: isSoldOut ? 'not-allowed' : 'pointer'
                }}
              >
                {isSoldOut ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag size={17} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-modal-content {
          max-height: 88vh;
        }
        .product-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          height: 100%;
          overflow-y: auto;
        }
        .product-modal-image-col {
          position: relative;
          height: 100%;
          min-height: 320px;
          background-color: #f5ede8;
        }
        .product-modal-details-col {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .product-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.85rem;
          padding-top: 1.1rem;
          border-top: 1px solid var(--color-cream-border);
          flex-wrap: wrap;
        }
        @media (max-width: 680px) {
          .product-modal-grid {
            grid-template-columns: 1fr;
          }
          .product-modal-image-col {
            min-height: 220px;
            max-height: 240px;
          }
          .product-modal-details-col {
            padding: 1.25rem;
          }
          .product-modal-footer {
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
