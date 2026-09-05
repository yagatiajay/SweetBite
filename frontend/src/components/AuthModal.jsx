import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Sparkles, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authTab, setAuthTab, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authTab === 'login') {
        await login(email, password);
      } else {
        await register(fullName, email, password, phone, address);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCustomer = () => {
    setEmail('sarah@sweetbite.com');
    setPassword('Password123!');
  };

  const handleFillAdmin = () => {
    setEmail('admin@sweetbite.com');
    setPassword('Admin123!');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          padding: '2.5rem 2.25rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '0.4rem',
            color: 'var(--color-cocoa-muted)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-caramel-gold), var(--color-cocoa-primary))',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            margin: '0 auto 0.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            🧁
          </div>
          <h3 style={{ fontSize: '1.65rem', color: 'var(--color-cocoa-dark)', marginBottom: '0.35rem' }}>
            {authTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-cocoa-muted)' }}>
            {authTab === 'login' ? 'Access your orders & sweet rewards' : 'Join Sweet Bite for fresh daily bakes'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--color-canvas)',
          borderRadius: 'var(--radius-full)',
          padding: '0.3rem',
          marginBottom: '1.75rem',
          border: '1px solid var(--color-cream-border)'
        }}>
          <button
            type="button"
            onClick={() => { setAuthTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              fontWeight: 700,
              backgroundColor: authTab === 'login' ? '#ffffff' : 'transparent',
              color: authTab === 'login' ? 'var(--color-cocoa-dark)' : 'var(--color-cocoa-muted)',
              boxShadow: authTab === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              fontWeight: 700,
              backgroundColor: authTab === 'register' ? '#ffffff' : 'transparent',
              color: authTab === 'register' ? 'var(--color-cocoa-dark)' : 'var(--color-cocoa-muted)',
              boxShadow: authTab === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {authTab === 'register' && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={17} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="Sarah Connor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-cream-border)',
                    backgroundColor: 'var(--color-canvas)',
                    outline: 'none',
                    fontSize: '0.95rem'
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
              <Mail size={17} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@sweetbite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-cream-border)',
                  backgroundColor: 'var(--color-canvas)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-cream-border)',
                  backgroundColor: 'var(--color-canvas)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {authTab === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    placeholder="+1 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cream-border)',
                      backgroundColor: 'var(--color-canvas)',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                  Delivery Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="var(--color-cocoa-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="City, Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cream-border)',
                      backgroundColor: 'var(--color-canvas)',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Spacious, uncrowded submit button */}
          <div style={{ marginTop: '0.85rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem 1.5rem',
                fontSize: '1rem',
                justifyContent: 'center',
                boxShadow: '0 6px 20px -4px rgba(61, 35, 20, 0.3)'
              }}
            >
              <span>{loading ? 'Please wait...' : authTab === 'login' ? 'Sign In to Sweet Bite' : 'Create My Account'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-cream-border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-muted)', marginBottom: '0.65rem' }}>
            Quick Demo Logins:
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleFillCustomer}
              style={{
                fontSize: '0.78rem',
                backgroundColor: 'var(--color-canvas)',
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
                fontSize: '0.78rem',
                backgroundColor: 'var(--color-caramel-soft)',
                color: 'var(--color-caramel-hover)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #f3d498',
                fontWeight: 700,
                transition: 'var(--transition-smooth)'
              }}
            >
              👑 Admin (Bakery Owner)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
