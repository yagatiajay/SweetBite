import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, authTab, setIsAuthModalOpen, closeAuthModal, setAuthTab, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    if (typeof closeAuthModal === 'function') {
      closeAuthModal();
    } else if (typeof setIsAuthModalOpen === 'function') {
      setIsAuthModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authTab === 'login') {
        await login(email, password);
      } else {
        await register({ fullName, email, password, phone, address });
      }
      handleClose();
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
      setAddress('');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCustomer = () => {
    setEmail('sarah@example.com');
    setPassword('Customer123!');
  };

  const handleFillAdmin = () => {
    setEmail('admin@sweetbite.com');
    setPassword('Admin123!');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          padding: 'clamp(1.25rem, 4vw, 2.25rem)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.4rem',
            color: 'var(--color-cocoa-muted)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Brand Icon & Welcome */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-cocoa-primary), var(--color-caramel-gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.35rem',
              margin: '0 auto 0.75rem',
              boxShadow: '0 6px 16px rgba(61, 35, 20, 0.2)'
            }}
          >
            🧁
          </div>

          <h3 style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 1.55rem)',
            color: 'var(--color-cocoa-dark)',
            margin: '0 0 0.25rem'
          }}>
            {authTab === 'login' ? 'Welcome Back to Sweet Bite' : 'Join the Sweet Bite Family'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)', margin: 0 }}>
            {authTab === 'login'
              ? 'Access your saved orders, reward points, and treat subscriptions.'
              : 'Create an account to track orders and receive exclusive fresh bake alerts.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--color-canvas-subtle)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.25rem',
          border: '1px solid var(--color-cream-border)'
        }}>
          <button
            type="button"
            onClick={() => { setAuthTab('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: authTab === 'login' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: authTab === 'login' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: authTab === 'register' ? 'var(--color-cocoa-primary)' : 'transparent',
              color: authTab === 'register' ? '#ffffff' : 'var(--color-cocoa-medium)',
              transition: 'var(--transition-smooth)'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {authTab === 'register' && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="Sarah Connor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-cream-border)',
                    backgroundColor: 'var(--color-canvas)',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@sweetbite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-cream-border)',
                  backgroundColor: 'var(--color-canvas)',
                  outline: 'none',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-cream-border)',
                  backgroundColor: 'var(--color-canvas)',
                  outline: 'none',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          {authTab === 'register' && (
            <div className="form-grid-2">
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    placeholder="+1 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem 0.7rem 2.3rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cream-border)',
                      backgroundColor: 'var(--color-canvas)',
                      outline: 'none',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                  Delivery Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={15} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="City, Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem 0.7rem 2.3rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cream-border)',
                      backgroundColor: 'var(--color-canvas)',
                      outline: 'none',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                fontSize: '0.98rem',
                justifyContent: 'center',
                boxShadow: '0 6px 20px -4px rgba(61, 35, 20, 0.3)'
              }}
            >
              <span>{loading ? 'Please wait...' : authTab === 'login' ? 'Sign In to Sweet Bite' : 'Create My Account'}</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-cream-border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', marginBottom: '0.5rem' }}>
            Quick Demo Logins:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleFillCustomer}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--color-canvas-subtle)',
                color: 'var(--color-cocoa-primary)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-cream-border)',
                fontWeight: 600,
                transition: 'var(--transition-smooth)'
              }}
            >
              👩 Customer (Sarah)
            </button>

            <button
              type="button"
              onClick={handleFillAdmin}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--color-caramel-soft)',
                color: 'var(--color-caramel-hover)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #f3d498',
                fontWeight: 700,
                transition: 'var(--transition-smooth)'
              }}
            >
              👑 Admin (Owner)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
