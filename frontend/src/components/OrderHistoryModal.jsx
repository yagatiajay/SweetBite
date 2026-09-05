import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders } from '../services/api';

export default function OrderHistoryModal() {
  const { isOrdersModalOpen, setIsOrdersModalOpen, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!isOrdersModalOpen || !user?.email) return;
      setLoading(true);
      try {
        const data = await fetchUserOrders(user.email);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [isOrdersModalOpen, user]);

  if (!isOrdersModalOpen) return null;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'baking':
        return { bg: '#ffe4e6', color: '#e11d48', label: '🥣 Baking in Oven' };
      case 'ready':
      case 'out for delivery':
        return { bg: '#f3e8ff', color: '#7e22ce', label: '🚀 Ready / En Route' };
      case 'delivered':
        return { bg: '#dcfce7', color: '#15803d', label: '✅ Delivered' };
      default:
        return { bg: '#fef3c7', color: '#b45309', label: '✦ Confirmed' };
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsOrdersModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          maxHeight: '88vh',
          padding: 'clamp(1rem, 3vw, 1.75rem)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-cream-border)',
          marginBottom: '1.25rem',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-berry-soft)',
              color: 'var(--color-berry-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Package size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.35rem)', color: 'var(--color-cocoa-dark)', margin: 0 }}>
                My Sweet Orders
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                History & live status for {user?.fullName || user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrdersModalOpen(false)}
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
            <X size={20} />
          </button>
        </div>

        {/* Orders List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-cocoa-muted)', fontSize: '0.92rem' }}>
              Loading your sweet orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧁</div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-cocoa-dark)', marginBottom: '0.35rem' }}>
                No orders yet
              </h4>
              <p style={{ color: 'var(--color-cocoa-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                When you place orders for brownies, cookies, or cakes, you'll see them right here!
              </p>
              <button
                type="button"
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
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
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
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.65rem',
                    borderBottom: '1px solid rgba(92, 56, 36, 0.08)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--color-cocoa-dark)' }}>
                          {ord.orderReference}
                        </strong>
                        <span style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {badge.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', marginTop: '2px' }}>
                        Placed on {new Date(ord.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-cocoa-dark)' }}>
                        ${ord.totalAmount.toFixed(2)}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-caramel-gold)', fontWeight: 600 }}>
                        {ord.paymentStatus} via {ord.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Fulfillment row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.78rem',
                    color: 'var(--color-cocoa-medium)',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {ord.deliveryType === 'Pickup' ? <Store size={14} /> : <Truck size={14} />}
                      <span><strong>{ord.deliveryType}</strong> scheduled for <strong>{ord.deliveryDate}</strong></span>
                    </div>
                  </div>

                  {/* Line items list */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    fontSize: '0.82rem'
                  }}>
                    {ord.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-cocoa-dark)', gap: '0.5rem' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.quantity}x {item.productName}</span>
                        <span style={{ color: 'var(--color-cocoa-muted)', flexShrink: 0 }}>${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {ord.specialNotes && (
                    <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--color-cocoa-light)', fontStyle: 'italic' }}>
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
