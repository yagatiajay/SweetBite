import React, { useState } from 'react';
import { Cake, Send, CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '../services/api';

export default function CustomOrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: 'Birthday Party',
    message: ''
  });

  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      await submitInquiry(formData);
      setStatus({ submitting: false, success: true, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        occasion: 'Birthday Party',
        message: ''
      });
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'Something went wrong. Please try again.'
      });
    }
  };

  return (
    <section id="custom-orders" className="section" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="custom-order-card">
          <div className="custom-order-grid">
            {/* Left Narrative */}
            <div>
              <div className="section-tag">
                <Cake size={14} />
                <span>Bespoke & Celebrations</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(1.9rem, 4vw, 3rem)',
                lineHeight: 1.15,
                color: 'var(--color-cocoa-dark)',
                marginBottom: '1rem'
              }}>
                Have a special <br />
                <span className="serif-italic">celebration in mind?</span>
              </h2>

              <p style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                color: 'var(--color-cocoa-light)',
                lineHeight: 1.65,
                marginBottom: '1.75rem'
              }}>
                Whether you're planning a multi-tiered floral wedding cake, a dessert banquet for 200 guests, or personalized corporate brownie gift boxes, our pastry designers bring your dreams to life.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem' }}>
                    ✓
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-cocoa-dark)', fontWeight: 600 }}>
                    Complimentary flavor tasting consultation
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem' }}>
                    ✓
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-cocoa-dark)', fontWeight: 600 }}>
                    Custom dietary menus (Eggless & GF available)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem' }}>
                    ✓
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-cocoa-dark)', fontWeight: 600 }}>
                    Chilled door-to-door celebration delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Right: The Form */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-cream-border)'
            }}>
              {status.success ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}>
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-cocoa-dark)', marginBottom: '0.5rem' }}>
                    Inquiry Received!
                  </h3>
                  <p style={{ color: 'var(--color-cocoa-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                    Thank you! Our head pastry chef will review your request and get in touch within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus({ ...status, success: false })}
                    className="btn btn-primary"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Emma Johnson"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.95rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-cream-border)',
                          backgroundColor: 'var(--color-canvas)',
                          outline: 'none',
                          fontSize: '0.92rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="emma@example.com"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.95rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-cream-border)',
                          backgroundColor: 'var(--color-canvas)',
                          outline: 'none',
                          fontSize: '0.92rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 019-2834"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.95rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-cream-border)',
                          backgroundColor: 'var(--color-canvas)',
                          outline: 'none',
                          fontSize: '0.92rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                        Occasion
                      </label>
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.95rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-cream-border)',
                          backgroundColor: 'var(--color-canvas)',
                          outline: 'none',
                          fontSize: '0.92rem'
                        }}
                      >
                        <option>Birthday Party</option>
                        <option>Wedding & Reception</option>
                        <option>Anniversary Celebration</option>
                        <option>Corporate Treat Crate</option>
                        <option>Baby Shower</option>
                        <option>Other Special Event</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cocoa-medium)', display: 'block', marginBottom: '0.35rem' }}>
                      Tell Us About Your Dream Treats *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Theme, desired flavors (e.g. Belgian chocolate, rose raspberry), date of event..."
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.95rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-cream-border)',
                        backgroundColor: 'var(--color-canvas)',
                        resize: 'vertical',
                        outline: 'none',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}
                  >
                    <Send size={17} />
                    <span>{status.submitting ? 'Sending Request...' : 'Send Custom Request'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
