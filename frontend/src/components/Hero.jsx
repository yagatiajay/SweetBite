import React from 'react';
import { ArrowRight, Star, Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Soft warm honey & golden caramel ambient glow (No pink) */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '5%',
        width: 'min(500px, 90vw)',
        height: 'min(500px, 90vw)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(246, 218, 168, 0.35) 0%, rgba(252, 250, 247, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '-10%',
        width: 'min(450px, 80vw)',
        height: 'min(450px, 80vw)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(238, 222, 196, 0.4) 0%, rgba(252, 250, 247, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-grid">
          {/* Text Content */}
          <div>
            <div className="section-tag" style={{ marginBottom: '1.25rem' }}>
              <Sparkles size={14} />
              <span>Artisan Bakery & Patisserie</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.3rem, 5.5vw, 4.2rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              color: 'var(--color-cocoa-dark)'
            }}>
              Sweet moments, <br />
              <span className="serif-italic" style={{ color: 'var(--color-caramel-gold)' }}>
                crafted to perfection.
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
              color: 'var(--color-cocoa-light)',
              lineHeight: 1.65,
              marginBottom: '2.25rem',
              maxWidth: '540px'
            }}>
              Freshly baked fudgy brownies, brown butter cookies, delicate celebration cakes, and flaky pastries made with 100% pure butter and organic ingredients.
            </p>

            {/* CTAs */}
            <div className="hero-actions">
              <a href="#treats" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.95rem 2rem' }}>
                <span>Explore Today's Treats</span>
                <ArrowRight size={18} />
              </a>

              <a href="#box-builder" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.95rem 1.8rem' }}>
                <span>Build a Treat Box</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="hero-trust-grid">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-caramel-gold)', marginBottom: '0.2rem' }}>
                  <Star size={16} fill="currentColor" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-cocoa-dark)' }}>4.9 / 5</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)' }}>1,200+ Reviews</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-caramel-gold)', marginBottom: '0.2rem' }}>
                  <ShieldCheck size={16} />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-cocoa-dark)' }}>100% Pure</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)' }}>French Butter</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-caramel-gold)', marginBottom: '0.2rem' }}>
                  <Award size={16} />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-cocoa-dark)' }}>Daily Bake</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)' }}>Warm from Oven</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Imagery */}
          <div className="hero-visual-col" style={{ position: 'relative' }}>
            {/* Main Visual Frame */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '6px solid #ffffff',
              background: '#f5efe6',
              aspectRatio: '4/3'
            }}>
              <img
                src="/hero-bakery.jpg"
                alt="Artisan bakery display of brownies, cookies, cake, and pastries at Sweet Bite"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.02)'
                }}
              />
            </div>

            {/* Floating Badge 1 - Top Right */}
            <div className="glass-pill animate-float hero-badge-top">
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-caramel-gold)',
                flexShrink: 0
              }} />
              <span style={{ fontWeight: 700, color: 'var(--color-cocoa-dark)', whiteSpace: 'nowrap' }}>
                Belgian Cocoa & Sea Salt
              </span>
            </div>

            {/* Floating Badge 2 - Bottom Left */}
            <div className="glass-pill hero-badge-bottom">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-caramel-soft)',
                color: 'var(--color-caramel-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Heart size={18} fill="currentColor" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-cocoa-dark)' }}>
                  Handcrafted with Care
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-cocoa-muted)' }}>
                  Zero preservatives, 100% natural
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
