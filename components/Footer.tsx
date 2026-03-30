'use client'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        padding: '1.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* Exact same gradient as WishForm <main> — seamless continuation */
        background: 'radial-gradient(ellipse at 30% 20%, #13102a 0%, #0a0a12 55%, #0a120d 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* Top shimmer border */
        .footer-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 15%; right: 15%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(240,192,64,0.2) 25%,
            rgba(232,84,122,0.3) 50%,
            rgba(192,64,240,0.2) 75%,
            transparent
          );
          pointer-events: none;
        }

        /* Ambient glow blobs */
        .footer-blob-l {
          position: absolute;
          width: 260px; height: 180px;
          left: -80px; bottom: -60px;
          background: radial-gradient(ellipse, rgba(240,192,64,0.045) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-blob-r {
          position: absolute;
          width: 260px; height: 180px;
          right: -80px; bottom: -60px;
          background: radial-gradient(ellipse, rgba(232,84,122,0.055) 0%, transparent 70%);
          pointer-events: none;
        }

        .footer-row {
          color: rgba(255,255,255,0.3);
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 1;
          transition: color 0.3s;
        }
        .footer-row:hover { color: rgba(255,255,255,0.55); }

        /* Heart ping */
        @keyframes fp-ping {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        .fp-ping {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #ec4899;
          animation: fp-ping 1.6s cubic-bezier(0.4,0,0.6,1) infinite;
        }

        /* Heart soft glow */
        @keyframes fp-glow {
          0%,100% { opacity: 0.5; transform: scale(1);   }
          50%      { opacity: 0.9; transform: scale(1.2); }
        }
        .fp-glow {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          background: rgba(236,72,153,0.15);
          filter: blur(7px);
          animation: fp-glow 1.6s ease-in-out infinite;
        }

        /* Heart icon beat */
        @keyframes fp-beat {
          0%,100% { transform: scale(1);    }
          15%      { transform: scale(1.18); }
          30%      { transform: scale(1);    }
          45%      { transform: scale(1.1);  }
          60%      { transform: scale(1);    }
        }
        .fp-heart {
          position: relative;
          z-index: 1;
          animation: fp-beat 1.6s ease-in-out infinite;
          filter: drop-shadow(0 0 7px rgba(236,72,153,0.9));
        }

        /* Brand name gradient text */
        .fp-brand {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.9rem;
          background: linear-gradient(130deg, #f0c040 0%, #e8547a 50%, #c040f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.03em;
        }

        .fp-dot {
          width: 2.5px; height: 2.5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
      `}</style>

      <div className="footer-blob-l" />
      <div className="footer-blob-r" />

      <p className="footer-row footer-inner">
        <span>Crafted with</span>

        {/* Animated heart */}
        <span style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '20px',
          flexShrink: 0,
        }}>
          <span className="fp-ping" />
          <span className="fp-glow" />
          <Heart
            className="fp-heart"
            size={15}
            fill="#ec4899"
            stroke="none"
          />
        </span>

        <span className="fp-dot" />
        <span>by</span>
        <span className="fp-brand">romanviki</span>
      </p>
    </footer>
  )
}
