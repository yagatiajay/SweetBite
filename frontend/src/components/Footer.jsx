import React, { useState } from 'react';
import { Heart, Mail, MapPin, Phone, Clock, ArrowRight, Check } from 'lucide-react';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{
      backgroundColor: 'var(--color-cocoa-dark)',
      color: '#fdf7f5',
      paddingTop: '5rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container">
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3.5rem',
          marginBottom: '4rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-caramel-gold), #fcd34d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: '#2a1810'
              }}>
                🧁
              </div>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#ffffff'
              }}>
                Sweet Bite
              </span>
            </div>

            <p style={{
              fontSize: '0.92rem',
              color: '#d6c4b8',
              lineHeight: 1.65,
              marginBottom: '1.5rem'
            }}>
              Crafting artisan brownies, cookies, celebration cakes, and pastries made with 100% pure butter and love for every sweet moment.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  transition: 'var(--transition-smooth)'
                }}
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="mailto:hello@sweetbitebakery.com"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  transition: 'var(--transition-smooth)'
                }}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '1.25rem',
              fontWeight: 700
            }}>
              Explore Bakes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: '#d6c4b8' }}>
              <a href="#treats" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#d6c4b8'}>
                Fudgy Brownies
              </a>
              <a href="#treats" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#d6c4b8'}>
                Brown Butter Cookies
              </a>
              <a href="#treats" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#d6c4b8'}>
                Celebration Cakes
              </a>
              <a href="#treats" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#d6c4b8'}>
                Flaky Viennoiseries
              </a>
              <a href="#box-builder" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#d6c4b8'}>
                Custom Treat Box
              </a>
            </div>
          </div>

          {/* Bakery Hours & Location */}
          <div>
            <h4 style={{
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '1.25rem',
              fontWeight: 700
            }}>
              Bakery & Pickup
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#d6c4b8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--color-caramel-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>124 Bakery Lane, San Francisco, CA 94107</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} color="var(--color-caramel-gold)" style={{ flexShrink: 0 }} />
                <span>Mon – Sun: 8:00 AM – 9:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="var(--color-caramel-gold)" style={{ flexShrink: 0 }} />
                <span>+1 (555) 321-CAKE (2253)</span>
              </div>
            </div>
          </div>

          {/* Newsletter Strip */}
          <div>
            <h4 style={{
              fontSize: '1.05rem',
              color: '#ffffff',
              marginBottom: '0.75rem',
              fontWeight: 700
            }}>
              Join the Sweet Club
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#d6c4b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Subscribe for fresh weekend bake drops and enjoy <strong>10% off</strong> your first treat order.
            </p>

            {subscribed ? (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#86efac',
                fontSize: '0.85rem'
              }}>
                <Check size={16} />
                <span>Welcome to the Sweet Club! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.65rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    flex: 1,
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--color-caramel-gold)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-full)',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  aria-label="Subscribe"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#a89487'
        }}>
          <div>
            © {new Date().getFullYear()} Sweet Bite Bakery. All rights reserved. Handcrafted with passion.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit' }}>Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
