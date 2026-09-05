import React from 'react';
import { ArrowRight, Star, Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      paddingTop: '2.5rem',
      paddingBottom: '5rem',
      overflow: 'hidden'
    }}>
      {/* Soft background ambient gradient glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 209, 220, 0.4) 0%, rgba(255, 246, 245, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '-10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(247, 236, 217, 0.5) 0%, rgba(255, 246, 245, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          {/* Text Content */}
          <div>
            <div className="section-tag" style={{ marginBottom: '1.25rem' }}>
              <Sparkles size={14} />
              <span>Artisan Bakery & Patisserie</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
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
              fontSize: '1.15rem',
              color: 'var(--color-cocoa-light)',
              lineHeight: 1.65,
              marginBottom: '2.25rem',
              maxWidth: '540px'
            }}>
              Freshly baked fudgy brownies, brown butter cookies, delicate celebration cakes, and flaky pastries made with 100% pure butter and organic ingredients.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '3rem'
            }}>
              <a href="#treats" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.95rem 2rem' }}>
                <span>Explore Today's Treats</span>
                <ArrowRight size={18} />
              </a>

              <a href="#box-builder" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.95rem 1.8rem' }}>
                <span>Build a Treat Box</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--color-cream-border)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-caramel-gold)', marginBottom: '0.2rem' }}>
                  <Star size={16} fill="currentColor" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-cocoa-dark)' }}>4.9 / 5</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)' }}>1,200+ Sweet Reviews</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-berry-rose)', marginBottom: '0.2rem' }}>
                  <ShieldCheck size={16} />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-cocoa-dark)' }}>100% Pure</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)' }}>French Butter & Cocoa</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-caramel-gold)', marginBottom: '0.2rem' }}>
                  <Award size={16} />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-cocoa-dark)' }}>Daily Bake</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cocoa-muted)' }}>Warm out of the oven</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Imagery */}
          <div style={{ position: 'relative' }}>
            {/* Main Visual Frame */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '6px solid #ffffff',
              background: '#f5ebe6',
              aspectRatio: '4/3'
            }}>
              <img
                src="/hero-bakery.jpg"
                alt="Artisan bakery display of brownies, cookies, cake, and pastries at Sweet Bite"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scale(1.02)',
                  transition: 'transform 0.6s ease'
                }}
              />
            </div>

            {/* Floating Badge 1 - Top Right */}
            <div
              className="glass-pill animate-float"
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-caramel-gold)'
              }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-cocoa-dark)' }}>
                Belgian Cocoa & Sea Salt
              </span>
            </div>

            {/* Floating Badge 2 - Bottom Left */}
            <div
              className="glass-pill"
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-15px',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: 'var(--shadow-float)'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-berry-soft)',
                color: 'var(--color-berry-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={20} fill="currentColor" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-cocoa-dark)' }}>
                  Handcrafted with Care
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-muted)' }}>
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
