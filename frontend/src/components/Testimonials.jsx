import React from 'react';
import { Star, Heart, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Eleanor Vance',
      occasion: 'Birthday Celebration',
      treatOrdered: 'Rose & Raspberry Chiffon Cake',
      quote: 'The Rose Chiffon cake became the centerpiece of our celebration! It was almost too beautiful to cut, and every single bite was cloud-soft and fragrant.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5
    },
    {
      name: 'Marcus Thorne',
      occasion: 'Weekly Indulgence',
      treatOrdered: 'Signature Fudgy Brownies (Box of 4)',
      quote: 'Hands down the best brownies in town. The combination of dark Belgian chocolate and flaky Maldon salt is pure magic. I order every Friday!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5
    },
    {
      name: 'Sophia Chen',
      occasion: 'Anniversary Gift',
      treatOrdered: 'Artisan Treat Box (6-Piece)',
      quote: 'Gifted the custom treat box to my partner for our anniversary. The packaging is gorgeous and the pistachio white chocolate cookie is unforgettable.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 5
    }
  ];

  return (
    <section id="reviews" className="section" style={{ backgroundColor: 'var(--color-canvas)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Heart size={14} />
            <span>Customer Love</span>
          </div>
          <h2 className="section-title">
            Loved by every <br />
            <span className="serif-italic">sweet tooth.</span>
          </h2>
          <p className="section-subtitle">
            Read what our wonderful dessert enthusiasts have to say about our handcrafted treats.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {reviews.map((rev, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2.25rem',
                border: '1px solid var(--color-cream-border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div>
                {/* Star rating */}
                <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--color-caramel-gold)', marginBottom: '1.25rem' }}>
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} size={18} fill="currentColor" />
                  ))}
                </div>

                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: 'var(--color-cocoa-primary)',
                  marginBottom: '1.75rem',
                  fontStyle: 'italic'
                }}>
                  "{rev.quote}"
                </p>
              </div>

              {/* Author & treat badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--color-cream-border)'
              }}>
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-cocoa-dark)' }}>
                      {rev.name}
                    </span>
                    <CheckCircle2 size={14} color="#16a34a" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-cocoa-muted)' }}>
                    Ordered: <strong style={{ color: 'var(--color-caramel-gold)' }}>{rev.treatOrdered}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
