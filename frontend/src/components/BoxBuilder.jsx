import React, { useState } from 'react';
import { Gift, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BoxBuilder() {
  const { addToCart } = useCart();
  const [boxSize, setBoxSize] = useState(4); // 4 or 6 items
  const [selectedItems, setSelectedItems] = useState([]);

  const boxOptions = [
    {
      id: 'brownie-classic',
      name: 'Fudgy Sea Salt Brownie',
      category: 'Brownie',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'brookie-caramel',
      name: 'Caramel Pretzel Brookie',
      category: 'Brownie',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1589218436045-ee320057f443?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'cookie-brown-butter',
      name: 'Brown Butter Choc Chunk',
      category: 'Cookie',
      price: 3.80,
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'cookie-pistachio',
      name: 'Sicilian Pistachio Cookie',
      category: 'Cookie',
      price: 4.20,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pastry-croissant',
      name: 'Almond Frangipane Croissant',
      category: 'Pastry',
      price: 4.80,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pastry-choux',
      name: 'Dark Berry Choux Craquelin',
      category: 'Pastry',
      price: 5.50,
      image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=400&q=80'
    },
  ];

  const handleAddItem = (item) => {
    if (selectedItems.length < boxSize) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleAddBoxToCart = () => {
    if (selectedItems.length === 0) return;

    const boxPrice = boxSize === 4 ? 18.00 : 26.00;
    const itemsSummary = selectedItems.map(i => i.name).join(', ');

    const boxProduct = {
      id: 9990 + boxSize,
      name: `Curated ${boxSize}-Piece Treat Box`,
      slug: `curated-${boxSize}-piece-treat-box`,
      price: boxPrice,
      weightOrServings: `Box of ${boxSize} Assorted Delights`,
      description: `Custom curated bakery gift box containing: ${itemsSummary}`,
      imageUrl: '/treat-box.jpg',
      isVeg: true,
      category: { name: 'Gift Box' },
      rating: 5.0,
      reviewCount: 38
    };

    addToCart(boxProduct, 1);
    setSelectedItems([]);
  };

  const isBoxFull = selectedItems.length === boxSize;
  const boxPrice = boxSize === 4 ? 18.00 : 26.00;

  return (
    <section id="box-builder" className="section" style={{ backgroundColor: '#fdf7f5' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Gift size={14} />
            <span>Interactive Box Builder</span>
          </div>
          <h2 className="section-title">
            Build Your Own <br />
            <span className="serif-italic">Artisan Treat Box</span>
          </h2>
          <p className="section-subtitle">
            Mix and match your favorite brownies, cookies, and flaky pastries. Packaged in our signature eco-friendly kraft box with botanical ribbon.
          </p>
        </div>

        <div className="box-builder-grid">
          {/* Left: Box Visual Preview & Slots */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.25rem, 3.5vw, 2rem)',
            border: '1px solid var(--color-cream-border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Box Size Toggle */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              backgroundColor: 'var(--color-canvas)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-full)'
            }}>
              <button
                type="button"
                onClick={() => {
                  setBoxSize(4);
                  if (selectedItems.length > 4) setSelectedItems(selectedItems.slice(0, 4));
                }}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.82rem, 2vw, 0.9rem)',
                  backgroundColor: boxSize === 4 ? 'var(--color-cocoa-primary)' : 'transparent',
                  color: boxSize === 4 ? '#ffffff' : 'var(--color-cocoa-medium)',
                  transition: 'var(--transition-smooth)',
                  textAlign: 'center'
                }}
              >
                4-Piece Box ($18.00)
              </button>
              <button
                type="button"
                onClick={() => setBoxSize(6)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.82rem, 2vw, 0.9rem)',
                  backgroundColor: boxSize === 6 ? 'var(--color-cocoa-primary)' : 'transparent',
                  color: boxSize === 6 ? '#ffffff' : 'var(--color-cocoa-medium)',
                  transition: 'var(--transition-smooth)',
                  textAlign: 'center'
                }}
              >
                6-Piece Box ($26.00)
              </button>
            </div>

            {/* Box Packaging Preview */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              aspectRatio: '16/9',
              backgroundColor: '#eada8c'
            }}>
              <img
                src="/treat-box.jpg"
                alt="Sweet Bite Artisan Treat Box"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '0.6rem',
                right: '0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--color-cocoa-dark)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {selectedItems.length} of {boxSize} selected
              </div>
            </div>

            {/* Slots Grid */}
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-cocoa-medium)' }}>
              Box Contents:
            </h4>

            <div className={boxSize === 4 ? "box-slots-grid-4" : "box-slots-grid-6"}>
              {Array.from({ length: boxSize }).map((_, idx) => {
                const item = selectedItems[idx];
                return (
                  <div
                    key={idx}
                    style={{
                      height: '78px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px dashed ${item ? 'var(--color-caramel-gold)' : 'var(--color-cream-border)'}`,
                      backgroundColor: item ? '#fdf8f4' : 'var(--color-canvas)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.4rem 0.5rem',
                      gap: '0.45rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {item ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cocoa-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--color-cocoa-muted)' }}>
                            {item.category}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{
                            color: '#e11d48',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                          aria-label={`Remove slot ${idx + 1}`}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    ) : (
                      <div style={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--color-cocoa-muted)',
                        fontWeight: 500
                      }}>
                        Slot {idx + 1} Empty
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total & Action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '1.1rem',
              borderTop: '1px solid var(--color-cream-border)',
              flexWrap: 'wrap'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', display: 'block' }}>Box Price</span>
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-cocoa-dark)'
                }}>
                  ${boxPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddBoxToCart}
                disabled={selectedItems.length === 0}
                className="btn btn-primary"
                style={{
                  opacity: selectedItems.length === 0 ? 0.5 : 1,
                  cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
                  padding: '0.75rem 1.4rem'
                }}
              >
                <ShoppingBag size={17} />
                <span>Add Box to Bag</span>
              </button>
            </div>
          </div>

          {/* Right: Available Treat Selector */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.35rem)', color: 'var(--color-cocoa-dark)' }}>
                Select Your Delights
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)' }}>
                Tap '+' to add to box
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {boxOptions.map((item) => {
                const countInBox = selectedItems.filter(i => i.id === item.id).length;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.95rem',
                      border: '1px solid var(--color-cream-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-cocoa-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-light)' }}>
                          {item.category} • ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      {countInBox > 0 && (
                        <span style={{
                          backgroundColor: 'var(--color-caramel-soft)', border: '1px solid var(--color-caramel-border)',
                          color: 'var(--color-caramel-gold)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.45rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {countInBox}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddItem(item)}
                        disabled={isBoxFull}
                        style={{
                          backgroundColor: isBoxFull ? '#e5e7eb' : 'var(--color-cocoa-primary)',
                          color: isBoxFull ? '#9ca3af' : '#ffffff',
                          borderRadius: 'var(--radius-full)',
                          width: '34px',
                          height: '34px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isBoxFull ? 'not-allowed' : 'pointer',
                          transition: 'var(--transition-bounce)'
                        }}
                        aria-label={`Add ${item.name} to box`}
                        title={isBoxFull ? 'Box is full' : 'Add to box'}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
