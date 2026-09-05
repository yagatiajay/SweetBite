import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Sparkles, User, LogOut, Package, ChevronDown, Menu, X, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, setIsOrdersModalOpen, setIsAdminModalOpen } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Core streamlined links - spacious and breathable
  const mainLinks = [
    { name: 'Treats & Menu', href: '#treats' },
    { name: 'Build a Box', href: '#box-builder' },
    { name: 'Custom Cakes', href: '#custom-orders' },
    { name: 'Our Story', href: '#story' },
  ];

  const getInitials = (name) => {
    if (!name) return 'SB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 900, width: '100%' }}>
      {/* Top Banner */}
      <div style={{
        backgroundColor: 'var(--color-berry-soft)',
        borderBottom: '1px solid var(--color-berry-border)',
        padding: '0.4rem 1rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'var(--color-berry-rose)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        letterSpacing: '0.02em'
      }}>
        <Sparkles size={13} />
        <span>Freshly baked daily at 6:00 AM • Free celebration delivery on orders over $40</span>
      </div>

      {/* Main Floating Nav Container */}
      <div style={{ padding: '0.65rem 1.25rem', display: 'flex', justifyContent: 'center' }}>
        <nav
          className="glass-pill"
          style={{
            width: '100%',
            maxWidth: '1060px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            transition: 'var(--transition-smooth)',
            boxShadow: isScrolled
              ? '0 16px 36px -10px rgba(61, 35, 20, 0.16)'
              : '0 8px 24px -6px rgba(61, 35, 20, 0.08)',
          }}
        >
          {/* Brand Logo */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-cocoa-primary), var(--color-caramel-gold))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.15rem',
                boxShadow: '0 4px 10px rgba(61, 35, 20, 0.2)',
              }}
            >
              🧁
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--color-cocoa-dark)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                Sweet Bite
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '0.85rem',
                  color: 'var(--color-caramel-gold)',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                artisan bakes
              </span>
            </div>
          </a>

          {/* Desktop Nav Links - Spacious, uncrowded layout */}
          <div
            className="desktop-links"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2.25rem',
              margin: '0 1.5rem'
            }}
          >
            {mainLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--color-cocoa-medium)',
                  transition: 'var(--transition-smooth)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-caramel-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-cocoa-medium)')}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {/* Admin Badge & Portal Trigger */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fcd34d',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  transition: 'var(--transition-smooth)',
                  boxShadow: '0 2px 8px rgba(182, 124, 38, 0.15)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fde68a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
              >
                <span>👑</span>
                <span>Admin Portal</span>
              </button>
            )}

            {/* User Profile / Auth Button */}
            {isAuthenticated ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: 'rgba(92, 56, 36, 0.06)',
                    padding: '0.35rem 0.7rem 0.35rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-cream-border)',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(92, 56, 36, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(92, 56, 36, 0.06)'}
                  aria-label="User account menu"
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-cocoa-primary)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getInitials(user?.fullName)}
                  </div>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--color-cocoa-dark)',
                    maxWidth: '85px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user?.fullName ? user.fullName.split(' ')[0] : 'Account'}
                  </span>
                  <ChevronDown size={14} color="var(--color-cocoa-muted)" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      padding: '0.5rem',
                      minWidth: '200px',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--color-cream-border)',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      animation: 'fadeIn 0.15s ease-out'
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-cream-border)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-cocoa-dark)' }}>
                        {user.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdminModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.75rem',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: '#92400e',
                          backgroundColor: '#fef3c7',
                          borderRadius: 'var(--radius-md)',
                          textAlign: 'left'
                        }}
                      >
                        <span>👑</span>
                        <span>Admin Portal</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsOrdersModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.88rem',
                        color: 'var(--color-cocoa-dark)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-canvas)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Package size={16} color="var(--color-caramel-gold)" />
                      <span>My Orders</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.88rem',
                        color: '#e11d48',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff1f2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--color-cocoa-primary)',
                  backgroundColor: 'rgba(92, 56, 36, 0.05)',
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-cream-border)',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(92, 56, 36, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(92, 56, 36, 0.05)'}
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--color-cocoa-primary)',
                color: '#ffffff',
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.88rem',
                transition: 'var(--transition-bounce)',
                boxShadow: '0 4px 12px rgba(61, 35, 20, 0.25)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              aria-label="View shopping bag"
            >
              <ShoppingBag size={17} />
              <span>Bag</span>
              {cartCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--color-caramel-gold)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '2px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem',
                color: 'var(--color-cocoa-dark)',
              }}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '1.25rem',
            right: '1.25rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
            border: '1px solid var(--color-cream-border)',
            zIndex: 899,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {mainLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--color-cocoa-primary)',
              }}
            >
              {link.name}
            </a>
          ))}

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-cream-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsAdminModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 800, color: '#92400e', backgroundColor: '#fef3c7', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
                  >
                    <span>👑</span>
                    <span>Admin Portal</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOrdersModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-cocoa-dark)' }}
                >
                  <Package size={18} color="var(--color-caramel-gold)" />
                  <span>My Orders ({user?.fullName})</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#e11d48' }}
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  openAuthModal('login');
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-primary btn-sm"
                style={{ justifyContent: 'center' }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 890px) {
          .desktop-links {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
