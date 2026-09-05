import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How far in advance should I place custom cake orders?',
      a: 'We recommend placing custom celebration cake orders at least 2 to 3 days in advance to ensure our pastry artists have ample time to prepare the delicate sponge, fillings, and floral decorations.'
    },
    {
      q: 'Do you offer eggless or vegan treats?',
      a: 'Yes! Over 80% of our brownie, cookie, and cake menu is 100% vegetarian / eggless. Look for the green "🌱 Eggless" badge on our treats or use our dietary filter button.'
    },
    {
      q: 'Are your baked goods prepared fresh every day?',
      a: 'Without exception. Our bakers arrive at 5:00 AM every single morning to pull warm brownies, cookies, and flaky pastries from the ovens. We never sell day-old baked goods.'
    },
    {
      q: 'How does delivery work for fragile cakes and pastries?',
      a: 'We use temperature-regulated, shock-absorbing custom bakery boxes with internal stability rings. All deliveries within our service zone are handled by dedicated dessert couriers.'
    },
    {
      q: 'What is the shelf life of your brownies and cookies?',
      a: 'Our brownies stay decadently fudgy for up to 5 days in an airtight container at room temperature (or up to 10 days refrigerated). Warm them for 15 seconds in the microwave for that heavenly molten center!'
    }
  ];

  return (
    <section id="faq" className="section" style={{ backgroundColor: 'var(--color-canvas)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-header">
          <div className="section-tag">
            <HelpCircle size={14} />
            <span>Common Questions</span>
          </div>
          <h2 className="section-title">
            Frequently Asked <br />
            <span className="serif-italic">questions.</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about our daily bakes, orders, delivery, and ingredients.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-cream-border)',
                  overflow: 'hidden',
                  boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: 'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.5rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    gap: '0.75rem'
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                    fontWeight: 700,
                    color: isOpen ? 'var(--color-caramel-gold)' : 'var(--color-cocoa-dark)',
                    transition: 'color 0.2s',
                    lineHeight: 1.3
                  }}>
                    {faq.q}
                  </span>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: 'var(--color-cocoa-muted)',
                    flexShrink: 0
                  }}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 clamp(1rem, 3vw, 1.5rem) 1.15rem',
                    color: 'var(--color-cocoa-light)',
                    fontSize: '0.92rem',
                    lineHeight: 1.65,
                    borderTop: '1px solid rgba(92, 56, 36, 0.05)',
                    paddingTop: '0.65rem',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
