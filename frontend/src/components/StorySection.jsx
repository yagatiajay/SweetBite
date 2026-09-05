import React from 'react';
import { Heart, Sparkles, Feather, Clock, ShieldCheck } from 'lucide-react';

export default function StorySection() {
  const pillars = [
    {
      icon: Heart,
      title: 'Handcrafted With Love',
      desc: 'Every single batch of brownies and cookies is hand-folded, portioned, and baked with passion.'
    },
    {
      icon: Sparkles,
      title: 'Finest Ingredients',
      desc: '72% Belgian dark cocoa, pure Normandy butter, Madagascar vanilla pods, and organic unbleached flour.'
    },
    {
      icon: Clock,
      title: 'Baked Daily at 6:00 AM',
      desc: 'We never sell day-old baked goods. What you receive was baked just hours earlier in our morning oven.'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Artificial Additives',
      desc: 'No artificial preservatives, food colorings, or emulsifiers. Pure, honest, delicious dessert artistry.'
    }
  ];

  return (
    <section id="story" className="section" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="story-grid">
          {/* Left: Atmospheric Baker Image */}
          <div className="story-visual-col" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '6px solid var(--color-canvas)',
              aspectRatio: '4/5'
            }}>
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80"
                alt="Artisan pastry chef dusting flour"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Accent Card */}
            <div className="glass-pill story-accent-card">
              <div style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(1.35rem, 3vw, 1.6rem)',
                color: 'var(--color-caramel-gold)',
                lineHeight: 1.15,
                marginBottom: '0.35rem'
              }}>
                From our kitchen to your celebrations
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-medium)', margin: 0 }}>
                Every treat tells a warm, sweet story.
              </p>
            </div>
          </div>

          {/* Right: The Narrative & Pillars */}
          <div>
            <div className="section-tag">
              <Feather size={14} />
              <span>Our Philosophy</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              lineHeight: 1.12,
              marginBottom: '1.25rem',
              color: 'var(--color-cocoa-dark)'
            }}>
              We believe great desserts <br />
              <span className="serif-italic">are made without compromise.</span>
            </h2>

            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              color: 'var(--color-cocoa-light)',
              lineHeight: 1.7,
              marginBottom: '2rem'
            }}>
              Sweet Bite started as a passionate pursuit to recreate the authentic, rich desserts that modern bakeries forgot: intense cocoa, caramelized browned butter, flaky viennoiseries, and real fruit compotes.
            </p>

            {/* 4 Pillars Grid */}
            <div className="story-pillars-grid">
              {pillars.map((pillar, i) => {
                const IconComponent = pillar.icon;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-canvas-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-caramel-gold)',
                      flexShrink: 0
                    }}>
                      <IconComponent size={19} />
                    </div>
                    <h4 style={{ fontSize: '0.98rem', color: 'var(--color-cocoa-dark)' }}>
                      {pillar.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-cocoa-muted)', lineHeight: 1.5 }}>
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
