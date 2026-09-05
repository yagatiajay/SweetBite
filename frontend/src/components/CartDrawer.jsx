import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Truck, Store, Sparkles, CreditCard, DollarSign, Smartphone, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import confetti from 'canvas-confetti';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user, isAuthenticated, setIsOrdersModalOpen } = useAuth();

  const [deliveryType, setDeliveryType] = useState('Delivery'); // Delivery or Pickup
  const [paymentMethod, setPaymentMethod] = useState('Card'); // Card | ApplePay | Cash
  
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    notes: ''
  });

  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    exp: '12/28',
    cvv: '888'
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Auto-fill customer details if logged in
  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 40.00;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cartTotal);
  const deliveryFee = deliveryType === 'Pickup' || cartTotal >= freeDeliveryThreshold ? 0 : 4.50;
  const grandTotal = cartTotal + deliveryFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitting(true);

    const orderPayload = {
      userId: user?.id || null,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      deliveryType: deliveryType,
      deliveryAddress: deliveryType === 'Delivery' ? customer.address : 'Store Pickup (Sweet Bite Bakery)',
      deliveryDate: customer.date,
      specialNotes: customer.notes,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'Cash' ? 'Pending' : 'Paid',
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    try {
      const orderResult = await createOrder(orderPayload);
      setConfirmedOrder(orderResult);
      clearCart();
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#b67c26', '#d64069', '#3d2314', '#ffe1db']
      });
    } catch (err) {
      alert('Could not process order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (confirmedOrder) {
      setConfirmedOrder(null);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={handleClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.15rem 1.5rem',
          borderBottom: '1px solid var(--color-cream-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--color-cocoa-dark)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
              Your Sweet Bag
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)', fontWeight: 600 }}>
              ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </div>

          <button
            onClick={handleClose}
            style={{
              padding: '0.4rem',
              color: 'var(--color-cocoa-dark)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {cartItems.length > 0 && !confirmedOrder && (
          <div style={{
            backgroundColor: remainingForFree === 0 ? 'var(--color-tag-veg-bg)' : 'var(--color-canvas)',
            padding: '0.6rem 1.5rem',
            fontSize: '0.82rem',
            color: remainingForFree === 0 ? 'var(--color-tag-veg-text)' : 'var(--color-cocoa-medium)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: '1px solid var(--color-cream-border)',
            fontWeight: 600
          }}>
            <Sparkles size={14} />
            {remainingForFree === 0 ? (
              <span>🎉 You unlocked FREE celebration delivery!</span>
            ) : (
              <span>Add <strong>${remainingForFree.toFixed(2)}</strong> more for FREE delivery!</span>
            )}
          </div>
        )}

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {confirmedOrder ? (
            /* Order Confirmation View */
            <div style={{ textAlign: 'center', padding: '2rem 0.5rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-berry-soft)',
                color: 'var(--color-berry-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle2 size={42} />
              </div>

              <span className="section-tag" style={{ marginBottom: '0.5rem' }}>Order Confirmed</span>

              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-cocoa-dark)', marginBottom: '0.5rem' }}>
                Ovens Are Heating Up!
              </h2>

              <p style={{ color: 'var(--color-cocoa-light)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Thank you, <strong>{confirmedOrder.customerName || customer.name}</strong>! Your order reference is:
              </p>

              <div style={{
                backgroundColor: 'var(--color-canvas)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid var(--color-cream-border)',
                marginBottom: '1.75rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-cocoa-muted)' }}>Reference:</span>
                  <strong style={{ color: 'var(--color-cocoa-dark)' }}>{confirmedOrder.orderReference}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-cocoa-muted)' }}>Fulfillment:</span>
                  <strong style={{ color: 'var(--color-caramel-gold)' }}>{deliveryType} on {customer.date}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-cocoa-muted)' }}>Payment:</span>
                  <strong style={{ color: 'var(--color-tag-veg-text)' }}>{paymentMethod} ({confirmedOrder.paymentStatus || 'Paid'})</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleClose();
                      setIsOrdersModalOpen(true);
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    View in My Orders
                  </button>
                )}
                <button onClick={handleClose} className="btn btn-primary" style={{ width: '100%' }}>
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧁</div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--color-cocoa-dark)', marginBottom: '0.5rem' }}>
                Your bag is empty
              </h4>
              <p style={{ color: 'var(--color-cocoa-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Treat yourself to our warm brownies, cookies, or cakes today!
              </p>
              <button onClick={handleClose} className="btn btn-primary">
                Browse Treats
              </button>
            </div>
          ) : (
            /* Items & Checkout Form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Authenticated user banner */}
              {isAuthenticated && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: 'var(--color-canvas)',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-cream-border)',
                  fontSize: '0.85rem'
                }}>
                  <ShieldCheck size={16} color="var(--color-caramel-gold)" />
                  <span>Logged in as <strong>{user.fullName}</strong></span>
                </div>
              )}

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      gap: '0.9rem',
                      alignItems: 'center',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid var(--color-cream-border)'
                    }}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        backgroundColor: '#f5ede8'
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontSize: '0.92rem',
                        color: 'var(--color-cocoa-dark)',
                        marginBottom: '0.2rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.product.name}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-caramel-gold)', fontWeight: 700 }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      backgroundColor: 'var(--color-canvas)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.15rem 0.35rem',
                      border: '1px solid var(--color-cream-border)'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        style={{ padding: '0.2rem', color: 'var(--color-cocoa-dark)' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        style={{ padding: '0.2rem', color: 'var(--color-cocoa-dark)' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{ color: '#9ca3af', padding: '0.35rem' }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery vs Pickup Selector */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-cocoa-dark)', display: 'block', marginBottom: '0.4rem' }}>
                  Fulfillment Method
                </label>
                <div style={{
                  display: 'flex',
                  backgroundColor: 'var(--color-canvas)',
                  padding: '0.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-cream-border)'
                }}>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('Delivery')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      backgroundColor: deliveryType === 'Delivery' ? 'var(--color-cocoa-primary)' : 'transparent',
                      color: deliveryType === 'Delivery' ? '#ffffff' : 'var(--color-cocoa-medium)'
                    }}
                  >
                    <Truck size={14} />
                    <span>Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('Pickup')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      backgroundColor: deliveryType === 'Pickup' ? 'var(--color-cocoa-primary)' : 'transparent',
                      color: deliveryType === 'Pickup' ? '#ffffff' : 'var(--color-cocoa-medium)'
                    }}
                  >
                    <Store size={14} />
                    <span>Bakery Pickup</span>
                  </button>
                </div>
              </div>

              {/* Checkout Form */}
              <form id="order-form" onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cream-border)',
                      backgroundColor: 'var(--color-canvas)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="form-grid-2" style={{ gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@mail.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-cream-border)',
                        backgroundColor: 'var(--color-canvas)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-cream-border)',
                        backgroundColor: 'var(--color-canvas)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {deliveryType === 'Delivery' && (
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, Apt, City"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-cream-border)',
                        backgroundColor: 'var(--color-canvas)',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                <div className="form-grid-2" style={{ gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      {deliveryType === 'Delivery' ? 'Delivery Date *' : 'Pickup Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={customer.date}
                      onChange={(e) => setCustomer({ ...customer, date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-cream-border)',
                        backgroundColor: 'var(--color-canvas)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.2rem' }}>
                      Gift Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Happy Birthday!"
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-cream-border)',
                        backgroundColor: 'var(--color-canvas)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Payment Gateway Method Selection */}
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-cocoa-dark)', display: 'block', marginBottom: '0.4rem' }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.6rem 0.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${paymentMethod === 'Card' ? 'var(--color-caramel-gold)' : 'var(--color-cream-border)'}`,
                        backgroundColor: paymentMethod === 'Card' ? 'var(--color-canvas)' : '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--color-cocoa-dark)'
                      }}
                    >
                      <CreditCard size={18} color="var(--color-caramel-gold)" />
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ApplePay')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.6rem 0.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${paymentMethod === 'ApplePay' ? 'var(--color-caramel-gold)' : 'var(--color-cream-border)'}`,
                        backgroundColor: paymentMethod === 'ApplePay' ? 'var(--color-canvas)' : '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--color-cocoa-dark)'
                      }}
                    >
                      <Smartphone size={18} color="var(--color-cocoa-primary)" />
                      <span>Apple Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.6rem 0.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${paymentMethod === 'Cash' ? 'var(--color-caramel-gold)' : 'var(--color-cream-border)'}`,
                        backgroundColor: paymentMethod === 'Cash' ? 'var(--color-canvas)' : '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--color-cocoa-dark)'
                      }}
                    >
                      <DollarSign size={18} color="#16a34a" />
                      <span>Pay Later</span>
                    </button>
                  </div>

                  {paymentMethod === 'Card' && (
                    <div style={{
                      backgroundColor: 'var(--color-canvas)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      border: '1px solid var(--color-cream-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-cocoa-muted)', display: 'block', marginBottom: '2px' }}>Card Number</span>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-cream-border)',
                            backgroundColor: '#ffffff',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-cocoa-muted)', display: 'block', marginBottom: '2px' }}>Exp (MM/YY)</span>
                          <input
                            type="text"
                            value={cardDetails.exp}
                            onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.45rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-cream-border)',
                              backgroundColor: '#ffffff',
                              fontSize: '0.85rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-cocoa-muted)', display: 'block', marginBottom: '2px' }}>CVC / CVV</span>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.45rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-cream-border)',
                              backgroundColor: '#ffffff',
                              fontSize: '0.85rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'ApplePay' && (
                    <div style={{
                      backgroundColor: 'var(--color-canvas)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      textAlign: 'center',
                      fontSize: '0.82rem',
                      color: 'var(--color-cocoa-medium)',
                      border: '1px solid var(--color-cream-border)'
                    }}>
                      ⚡ Quick 1-tap checkout ready via Apple Pay / Touch ID
                    </div>
                  )}

                  {paymentMethod === 'Cash' && (
                    <div style={{
                      backgroundColor: 'var(--color-canvas)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      textAlign: 'center',
                      fontSize: '0.82rem',
                      color: 'var(--color-cocoa-medium)',
                      border: '1px solid var(--color-cream-border)'
                    }}>
                      💵 Pay with Cash or Card upon delivery or at bakery pickup
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Drawer Footer / Totals */}
        {cartItems.length > 0 && !confirmedOrder && (
          <div style={{
            padding: '1.15rem 1.5rem',
            borderTop: '1px solid var(--color-cream-border)',
            backgroundColor: 'var(--color-canvas)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem', color: 'var(--color-cocoa-medium)' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.88rem', color: 'var(--color-cocoa-medium)' }}>
              <span>{deliveryType} Fee</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 700,
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-cocoa-dark)',
              borderTop: '1px solid var(--color-cream-border)',
              paddingTop: '0.65rem'
            }}>
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              form="order-form"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.98rem', justifyContent: 'center' }}
            >
              <span>{submitting ? 'Authorizing & Baking...' : `Pay $${grandTotal.toFixed(2)} & Reserve`}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
