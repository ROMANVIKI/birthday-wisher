'use client'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 30% 20%, #13102a 0%, #0a0a12 55%, #0a120d 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* Subtle shimmer line at top */
        .footer-shimmer::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(240,192,64,0.25) 30%,
            rgba(232,84,122,0.35) 50%,
            rgba(192,64,240,0.25) 70%,
            transparent
          );
        }

        /* Ambient glow blobs */
        .footer-blob-left {
          position: absolute;
          width: 220px; height: 220px;
          left: -60px; bottom: -80px;
          background: radial-gradient(circle, rgba(240,192,64,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-blob-right {
          position: absolute;
          width: 220px; height: 220px;
          right: -60px; bottom: -80px;
          background: radial-gradient(circle, rgba(232,84,122,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .footer-text {
          color: rgba(255,255,255,0.32);
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          transition: color 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .footer-text:hover {
          color: rgba(255,255,255,0.6);
        }

        /* Heart ping ring */
        @keyframes heartPing {
          0%   { transform: scale(1);   opacity: 0.75; }
          75%  { transform: scale(2.2); opacity: 0;    }
          100% { transform: scale(2.2); opacity: 0;    }
        }
        .heart-ping {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(236, 72, 153, 0.55);
          animation: heartPing 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Heart glow pulse */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1);   }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        .heart-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(236, 72, 153, 0.18);
          filter: blur(6px);
          animation: glowPulse 1.5s ease-in-out infinite;
        }

        /* Heart icon subtle beat */
        @keyframes heartBeat {
          0%, 100% { transform: scale(1);    }
          14%       { transform: scale(1.12); }
          28%       { transform: scale(1);    }
          42%       { transform: scale(1.08); }
          70%       { transform: scale(1);    }
        }
        .heart-icon {
          animation: heartBeat 1.5s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(236,72,153,0.85));
        }

        .brand-name {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 400;
          font-size: 0.88rem;
          background: linear-gradient(135deg, #f0c040 0%, #e8547a 55%, #c040f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.04em;
        }

        .footer-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          display: inline-block;
        }
      `}</style>

      {/* Ambient blobs */}
      <div className="footer-blob-left" />
      <div className="footer-blob-right" />

      <p className="footer-text footer-shimmer">
        <span>Crafted with</span>

        {/* Animated heart */}
        <span
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
          }}
        >
          <span className="heart-ping" />
          <span className="heart-glow" />
          <Heart
            className="heart-icon"
            size={16}
            fill="#ec4899"
            stroke="none"
            style={{ position: 'relative', zIndex: 1 }}
          />
        </span>

        <span className="footer-dot" />

        <span>by</span>

        <span className="brand-name">romanviki</span>
      </p>
    </footer>
  )
}
