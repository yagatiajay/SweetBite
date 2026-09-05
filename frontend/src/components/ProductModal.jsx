import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Star, Sparkles, AlertCircle, Tag } from 'lucide-react';
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
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '88vh' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          height: '100%',
          overflowY: 'auto'
        }}>
          {/* Image */}
          <div style={{ position: 'relative', height: '100%', minHeight: '320px', backgroundColor: '#f5ede8' }}>
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
                  fontSize: '0.9rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Sold Out for Today
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
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
                  fontSize: '0.75rem',
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
                  fontSize: '0.75rem',
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
              fontSize: '1.75rem',
              color: 'var(--color-cocoa-dark)',
              marginBottom: '0.35rem',
              lineHeight: 1.2
            }}>
              {quickViewProduct.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-caramel-gold)' }}>
                <Star size={16} fill="currentColor" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-cocoa-dark)' }}>
                  {quickViewProduct.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-cocoa-muted)' }}>
                  ({quickViewProduct.reviewCount} reviews)
                </span>
              </div>

              <span style={{ color: 'var(--color-cocoa-muted)' }}>•</span>

              <span style={{ fontSize: '0.9rem', color: 'var(--color-cocoa-medium)', fontWeight: 500 }}>
                {quickViewProduct.weightOrServings}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-cocoa-medium)',
              lineHeight: 1.6,
              marginBottom: '1.25rem'
            }}>
              {quickViewProduct.description}
            </p>

            {/* Flavour notes */}
            {quickViewProduct.flavourNotes && (
              <div style={{
                backgroundColor: 'var(--color-canvas-subtle)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--color-cream-border)'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-caramel-gold)',
                  marginBottom: '0.2rem',
                  letterSpacing: '0.04em'
                }}>
                  Flavor Profile
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-cocoa-dark)' }}>
                  {quickViewProduct.flavourNotes}
                </div>
              </div>
            )}

            {/* Ingredients & Allergens */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-cocoa-light)', flex: 1 }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--color-cocoa-dark)' }}>Ingredients: </strong>
                {quickViewProduct.ingredients || 'Hand-selected organic flour, pure butter, cane sugar, fine chocolate.'}
              </div>
              {quickViewProduct.allergens && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b45309', fontSize: '0.8rem' }}>
                  <AlertCircle size={14} />
                  <span>Contains: {quickViewProduct.allergens}</span>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-cream-border)'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)', display: 'block' }}>Total</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-cocoa-dark)'
                  }}>
                    ${(quickViewProduct.price * quantity).toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span style={{
                      fontSize: '1rem',
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
                  padding: '0.25rem 0.5rem'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.4rem', color: 'var(--color-cocoa-dark)' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quickViewProduct.stockQuantity, quantity + 1))}
                    style={{ padding: '0.4rem', color: 'var(--color-cocoa-dark)' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
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
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  backgroundColor: isSoldOut ? '#e5e7eb' : 'var(--color-cocoa-primary)',
                  color: isSoldOut ? '#9ca3af' : '#ffffff',
                  cursor: isSoldOut ? 'not-allowed' : 'pointer'
                }}
              >
                {isSoldOut ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
