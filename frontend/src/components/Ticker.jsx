import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Ticker() {
  const items = [
    'Baked Fresh Daily at Dawn',
    '70% Valrhona Belgian Chocolate',
    'Pure Normandy Laminated Butter',
    'Artisanal Slow-Proofed Dough',
    'Custom Celebration Cake Artistry',
    'Hand-Harvested Maldon Sea Salt',
    'Same-Day Delivery Available',
    '100% Eggless Treats Available',
  ];

  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {/* Double array for infinite marquee illusion */}
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="ticker-item">
            <span className="ticker-bullet">✦</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
