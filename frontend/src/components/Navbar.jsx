import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Sparkles, User, LogOut, Package, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, setIsOrdersModalOpen, setIsAdminModalOpen } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown & mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        padding: '0.35rem 0.75rem',
        textAlign: 'center',
        fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
        fontWeight: '600',
        color: 'var(--color-berry-rose)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        letterSpacing: '0.02em',
        lineHeight: 1.3
      }}>
        <Sparkles size={13} style={{ flexShrink: 0 }} />
        <span>Freshly baked daily at 6 AM • Free celebration delivery on orders over $40</span>
      </div>

      {/* Main Floating Nav Container */}
      <div className="nav-wrapper">
        <nav
          className="glass-pill nav-pill"
          style={{
            width: '100%',
            maxWidth: '1060px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
              gap: '0.5rem',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-cocoa-primary), var(--color-caramel-gold))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.1rem',
                boxShadow: '0 4px 10px rgba(61, 35, 20, 0.2)',
                flexShrink: 0
              }}
            >
              🧁
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)',
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
                className="nav-brand-sub"
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '0.8rem',
                  color: 'var(--color-caramel-gold)',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                artisan bakes
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div
            className="desktop-links"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
              margin: '0 1rem'
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

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(92, 56, 36, 0.06)',
                    padding: '0.35rem 0.65rem 0.35rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-cream-border)',
                    transition: 'var(--transition-smooth)'
                  }}
                  aria-label="User Account"
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isAdmin ? 'var(--color-caramel-gold)' : 'var(--color-cocoa-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    {isAdmin ? '👑' : getInitials(user?.fullName)}
                  </div>
                  <span className="nav-user-name" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-dark)' }}>
                    {user?.fullName?.split(' ')[0] || 'My Account'}
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
                      width: '220px',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--color-cream-border)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      zIndex: 1000,
                      animation: 'fadeIn 0.15s ease-out'
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-cream-border)', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-cocoa-dark)' }}>
                        {user?.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email}
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
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#92400e',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#fef3c7',
                          textAlign: 'left'
                        }}
                      >
                        <span>👑</span>
                        <span>Bakery Admin Portal</span>
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
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
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
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.85rem',
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
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--color-cocoa-primary)',
                  backgroundColor: 'rgba(92, 56, 36, 0.05)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-cream-border)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <User size={14} />
                <span className="nav-signin-label">Sign In</span>
              </button>
            )}

            {/* Cart Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--color-cocoa-primary)',
                color: '#ffffff',
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'var(--transition-bounce)',
                boxShadow: '0 4px 12px rgba(61, 35, 20, 0.2)',
                flexShrink: 0
              }}
              aria-label="View shopping bag"
            >
              <ShoppingBag size={16} />
              <span className="nav-bag-label">Bag</span>
              {cartCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--color-caramel-gold)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '1px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isMobileMenuOpen ? 'rgba(92, 56, 36, 0.1)' : 'transparent',
                color: 'var(--color-cocoa-dark)',
                flexShrink: 0
              }}
              className="mobile-menu-btn"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'absolute',
            top: 'calc(100% - 4px)',
            left: '0.85rem',
            right: '0.85rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: '0 16px 36px -8px rgba(42, 24, 16, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: '1px solid var(--color-cream-border)',
            zIndex: 899,
            animation: 'fadeIn 0.2s ease-out',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto'
          }}
        >
          {mainLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-cocoa-primary)',
                padding: '0.5rem 0.25rem',
                borderBottom: '1px solid rgba(92, 56, 36, 0.05)'
              }}
            >
              {link.name}
            </a>
          ))}

          <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsAdminModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#92400e',
                      backgroundColor: '#fef3c7',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left'
                    }}
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: 'var(--color-cocoa-dark)',
                    padding: '0.5rem 0.25rem'
                  }}
                >
                  <Package size={17} color="var(--color-caramel-gold)" />
                  <span>My Orders ({user?.fullName})</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: '#e11d48',
                    padding: '0.5rem 0.25rem'
                  }}
                >
                  <LogOut size={17} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  openAuthModal('login');
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-primary"
                style={{ justifyContent: 'center', width: '100%', padding: '0.75rem' }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .nav-wrapper {
          padding: 0.65rem 1.25rem;
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .nav-pill {
          padding: 0.5rem 1.4rem;
        }
        @media (max-width: 890px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (min-width: 891px) {
          .desktop-links {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .nav-wrapper {
            padding: 0.45rem 0.75rem;
          }
          .nav-pill {
            padding: 0.45rem 0.85rem;
          }
          .nav-user-name {
            display: none;
          }
        }
        @media (max-width: 380px) {
          .nav-brand-sub {
            display: none !important;
          }
          .nav-signin-label {
            display: none;
          }
          .nav-bag-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
