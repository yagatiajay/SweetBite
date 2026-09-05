import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, ChevronRight, Truck, Store, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders } from '../services/api';

export default function OrderHistoryModal() {
  const { user, isOrdersModalOpen, setIsOrdersModalOpen } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOrdersModalOpen && user?.email) {
      setLoading(true);
      fetchUserOrders(user.email)
        .then(data => setOrders(data))
        .finally(() => setLoading(false));
    }
  }, [isOrdersModalOpen, user?.email]);

  if (!isOrdersModalOpen) return null;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'baking':
        return { bg: '#ffe4e6', color: '#e11d48', label: '🥣 Baking in Oven' };
      case 'ready':
      case 'out for delivery':
        return { bg: '#f3e8ff', color: '#7e22ce', label: '🚀 Ready for Pickup / En Route' };
      case 'delivered':
        return { bg: '#dcfce7', color: '#15803d', label: '✅ Delivered / Completed' };
      default:
        return { bg: '#fef3c7', color: '#b45309', label: '✦ Confirmed & Scheduled' };
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsOrdersModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '85vh', padding: '2rem', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--color-cream-border)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
              <Package size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                My Sweet Orders
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)', margin: 0 }}>
                Order history & live delivery tracking for {user?.fullName || user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOrdersModalOpen(false)}
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

        {/* Orders List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-cocoa-muted)' }}>
              Loading your sweet orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🧁</div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--color-cocoa-dark)', marginBottom: '0.35rem' }}>
                No orders yet
              </h4>
              <p style={{ color: 'var(--color-cocoa-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                When you place orders for brownies, cookies, or cakes, you'll see them right here!
              </p>
              <button
                onClick={() => setIsOrdersModalOpen(false)}
                className="btn btn-primary btn-sm"
              >
                Browse Today's Treats
              </button>
            </div>
          ) : (
            orders.map((ord) => {
              const badge = getStatusBadge(ord.status);
              return (
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
                  {/* Order header row */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(92, 56, 36, 0.08)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-cocoa-dark)' }}>
                          {ord.orderReference}
                        </strong>
                        <span style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {badge.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-muted)', marginTop: '2px' }}>
                        Placed on {new Date(ord.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-cocoa-dark)' }}>
                        ${ord.totalAmount.toFixed(2)}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-caramel-gold)', fontWeight: 600 }}>
                        {ord.paymentStatus} via {ord.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Fulfillment row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.82rem',
                    color: 'var(--color-cocoa-medium)',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {ord.deliveryType === 'Pickup' ? <Store size={15} /> : <Truck size={15} />}
                      <span><strong>{ord.deliveryType}</strong> scheduled for <strong>{ord.deliveryDate}</strong></span>
                    </div>
                  </div>

                  {/* Line items list */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    fontSize: '0.85rem'
                  }}>
                    {ord.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-cocoa-dark)' }}>
                        <span>{item.quantity}x {item.productName}</span>
                        <span style={{ color: 'var(--color-cocoa-muted)' }}>${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {ord.specialNotes && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--color-cocoa-light)', fontStyle: 'italic' }}>
                      Note: "{ord.specialNotes}"
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
