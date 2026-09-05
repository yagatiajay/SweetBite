import React, { useState } from 'react';
import { Gift, Plus, Check, Sparkles, Trash2, ShoppingBag } from 'lucide-react';
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Left: Box Visual Preview & Slots */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            border: '1px solid var(--color-cream-border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Box Size Toggle */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              backgroundColor: 'var(--color-canvas)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-full)'
            }}>
              <button
                onClick={() => {
                  setBoxSize(4);
                  if (selectedItems.length > 4) setSelectedItems(selectedItems.slice(0, 4));
                }}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  backgroundColor: boxSize === 4 ? 'var(--color-cocoa-primary)' : 'transparent',
                  color: boxSize === 4 ? '#ffffff' : 'var(--color-cocoa-medium)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                4-Piece Box ($18.00)
              </button>
              <button
                onClick={() => setBoxSize(6)}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  backgroundColor: boxSize === 6 ? 'var(--color-cocoa-primary)' : 'transparent',
                  color: boxSize === 6 ? '#ffffff' : 'var(--color-cocoa-medium)',
                  transition: 'var(--transition-smooth)'
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
              marginBottom: '1.5rem',
              aspectRatio: '16/9',
              backgroundColor: '#eada range'
            }}>
              <img
                src="/treat-box.jpg"
                alt="Sweet Bite Artisan Treat Box"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--color-cocoa-dark)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {selectedItems.length} of {boxSize} selected
              </div>
            </div>

            {/* Slots Grid */}
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-cocoa-medium)' }}>
              Box Contents:
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${boxSize === 4 ? 2 : 3}, 1fr)`,
              gap: '0.75rem',
              marginBottom: '1.75rem'
            }}>
              {Array.from({ length: boxSize }).map((_, idx) => {
                const item = selectedItems[idx];
                return (
                  <div
                    key={idx}
                    style={{
                      height: '84px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px dashed ${item ? 'var(--color-caramel-gold)' : 'var(--color-cream-border)'}`,
                      backgroundColor: item ? '#fdf8f4' : 'var(--color-canvas)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem',
                      gap: '0.5rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {item ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-cocoa-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-cocoa-muted)' }}>
                            {item.category}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          style={{
                            color: '#e11d48',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
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
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-cream-border)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', display: 'block' }}>Box Price</span>
                <span style={{
                  fontSize: '1.5rem',
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
                  cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ShoppingBag size={18} />
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
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-cocoa-dark)' }}>
                Select Your Delights
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-cocoa-muted)' }}>
                Tap '+' to add to box
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {boxOptions.map((item) => {
                const countInBox = selectedItems.filter(i => i.id === item.id).length;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--color-cream-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-cocoa-dark)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-light)' }}>
                          {item.category} • Individual: ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {countInBox > 0 && (
                        <span style={{
                          backgroundColor: 'var(--color-berry-soft)',
                          color: 'var(--color-berry-rose)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {countInBox} in box
                        </span>
                      )}

                      <button
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
