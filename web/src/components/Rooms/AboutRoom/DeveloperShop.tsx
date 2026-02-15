import React, { useState } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   DeveloperShop — Easter egg: clicking the "Select Your Developer"
   title reveals a full shop with product cards and prices.
   ────────────────────────────────────────────────────────────────────── */

interface ShopItem {
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
  emoji: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    name: 'Clean Code™',
    tagline: 'Readable, maintainable, occasionally beautiful',
    price: 'Free',
    originalPrice: '$4,999',
    rating: 5,
    reviews: 127,
    badge: 'BESTSELLER',
    features: ['Variable names that make sense', 'Comments (mostly apologies)', 'No magic numbers'],
    emoji: '✨',
  },
  {
    name: 'Full-Stack Package',
    tagline: 'Front-end to back-end, no gaps',
    price: 'Free',
    originalPrice: '$12,000',
    rating: 5,
    reviews: 89,
    badge: 'BUNDLE DEAL',
    features: ['React + TypeScript', 'Node.js / Python', 'Database whispering'],
    emoji: '📦',
  },
  {
    name: 'Friday Deploys™',
    tagline: 'Lives dangerously. Survives.',
    price: 'Free',
    originalPrice: '$999',
    rating: 4.8,
    reviews: 54,
    features: ['CI/CD pipeline included', 'Rollback muscle memory', 'Zero downtime (usually)'],
    emoji: '🚀',
  },
  {
    name: 'Error Message Reader',
    tagline: 'Reads the WHOLE stack trace. Yes, really.',
    price: 'Free',
    originalPrice: '$2,499',
    rating: 5,
    reviews: 203,
    badge: 'STAFF PICK',
    features: ['Actually reads logs', 'Doesn\'t just Google first line', 'Root cause analysis'],
    emoji: '🔍',
  },
  {
    name: 'Code Comments Deluxe',
    tagline: 'Mostly apologies and TODOs',
    price: 'Free',
    originalPrice: '$799',
    rating: 4.5,
    reviews: 31,
    features: ['Honest documentation', 'Future self warnings', '"I know this is bad but..."'],
    emoji: '📝',
  },
  {
    name: 'Portfolio Website',
    tagline: 'You\'re on it right now',
    price: 'Free',
    originalPrice: '$8,500',
    rating: 5,
    reviews: 1,
    badge: 'NEW',
    features: ['Hidden pages', 'Chatbot that talks back', 'Way too much CSS'],
    emoji: '🌐',
  },
  {
    name: '2am Debugging Session',
    tagline: 'Peak performance. Questionable decisions.',
    price: 'Free',
    originalPrice: '$3,000',
    rating: 4.2,
    reviews: 67,
    features: ['Hyperfocus mode', 'Energy drink compatibility', 'git blame immunity'],
    emoji: '🌙',
  },
  {
    name: 'The Whole Developer',
    tagline: 'Everything above. One person. Somehow.',
    price: 'Free',
    originalPrice: '$49,999',
    rating: 5,
    reviews: 412,
    badge: 'BEST VALUE',
    features: ['All skills included', 'Waterloo CE certified', 'Comes with dad jokes'],
    emoji: '🧑‍💻',
  },
];

const DeveloperShop: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cart, setCart] = useState<Set<number>>(new Set());

  const addToCart = (index: number) => {
    setCart(prev => { const n = new Set(prev); n.add(index); return n; });
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span style={{ color: '#f59e42', fontSize: 12, letterSpacing: 1 }}>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#f8f8f8',
      zIndex: 10,
      overflowY: 'auto',
      animation: 'shopFadeIn 0.4s ease',
    }}>
      <style>{`
        @keyframes shopFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shopCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shop-card {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          padding: 20px;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
          opacity: 0;
          animation: shopCardIn 0.4s ease forwards;
        }
        .shop-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .shop-add-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .shop-add-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '24px 32px 16px',
        borderBottom: '1px solid #e8e8e8',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 24,
            fontWeight: 900,
            color: '#111',
            margin: 0,
          }}>🛒 Developer Shop</h2>
          <p style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            color: '#888',
            margin: '4px 0 0',
            fontStyle: 'italic',
          }}>Everything's free. It's a portfolio. What did you expect?</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            color: '#666',
            background: '#f0f0f0',
            padding: '6px 12px',
            borderRadius: 20,
          }}>
            🛒 {cart.size} item{cart.size !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: '#666',
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: '6px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.color = '#111'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#666'; }}
          >
            ← Back to comparison
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
        padding: '24px 32px',
      }}>
        {SHOP_ITEMS.map((item, i) => (
          <div
            key={i}
            className="shop-card"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {/* Badge */}
            {item.badge && (
              <span style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: item.badge === 'BEST VALUE' ? '#111' : item.badge === 'BESTSELLER' ? '#f59e42' : '#6366f1',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '3px 8px',
                borderRadius: 4,
                fontFamily: "'Lato', sans-serif",
              }}>{item.badge}</span>
            )}

            {/* Emoji + Name */}
            <div style={{ fontSize: 32, marginBottom: 8 }}>{item.emoji}</div>
            <h3 style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 16,
              fontWeight: 900,
              color: '#111',
              margin: '0 0 4px',
            }}>{item.name}</h3>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 12,
              color: '#888',
              fontStyle: 'italic',
              margin: '0 0 10px',
              lineHeight: 1.4,
            }}>{item.tagline}</p>

            {/* Rating */}
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              {renderStars(item.rating)}
              <span style={{ fontSize: 11, color: '#aaa', fontFamily: "'Lato', sans-serif" }}>
                ({item.reviews})
              </span>
            </div>

            {/* Features */}
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 16px',
            }}>
              {item.features.map((feat, j) => (
                <li key={j} style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 12,
                  color: '#555',
                  padding: '2px 0',
                  lineHeight: 1.4,
                }}>
                  <span style={{ color: '#1a9e3f', marginRight: 6 }}>✓</span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 12,
            }}>
              <span style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 22,
                fontWeight: 900,
                color: '#1a9e3f',
              }}>{item.price}</span>
              {item.originalPrice && (
                <span style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 13,
                  color: '#bbb',
                  textDecoration: 'line-through',
                }}>{item.originalPrice}</span>
              )}
            </div>

            {/* Add to cart */}
            <button
              className="shop-add-btn"
              onClick={() => addToCart(i)}
              style={{
                background: cart.has(i) ? '#e8e8e8' : '#111',
                color: cart.has(i) ? '#888' : '#fff',
              }}
            >
              {cart.has(i) ? '✓ Added' : '🛒 Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 32px 32px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 11,
          color: '#bbb',
          fontStyle: 'italic',
        }}>
          * No real transactions. This is a portfolio. All "products" are metaphors for skills.
          Your "cart" will be lost when you close this page. No refunds on free items.
        </p>
      </div>
    </div>
  );
};

export default DeveloperShop;
