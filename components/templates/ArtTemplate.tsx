'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Wish } from '@/types'

interface Props { wish: Wish }

// Painterly ink stroke paths (SVG decorative flourishes)
const BRUSHSTROKES = [
  { d: 'M20,80 C60,40 120,100 180,60 S280,20 340,50', color: 'rgba(180,120,60,0.18)', w: 3 },
  { d: 'M640,200 C600,180 560,240 520,200 S440,160 400,190', color: 'rgba(140,90,160,0.15)', w: 2.5 },
  { d: 'M0,400 C80,380 160,430 240,400 S380,360 440,390', color: 'rgba(90,130,80,0.12)', w: 2 },
  { d: 'M200,550 C260,530 320,570 380,545 S480,510 540,540', color: 'rgba(160,80,60,0.14)', w: 2.5 },
]

// Swirling ink particle specs
const INK_DROPS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 137.5) % 100,
  size: 1.5 + (i % 3) * 1.2,
  hue: [30, 280, 140, 200, 350][i % 5],
  delay: (i * 0.31) % 5,
  dur: 6 + (i % 4) * 2,
}))

export function ArtTemplate({ wish }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<SVGSVGElement>(null)
  const ornamentRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)
  const inkLayerRef = useRef<HTMLDivElement>(null)

  const isTypewriter = wish.textEffect === 'typewriter'

  const { displayed: typedMsg } = useTypewriter({
    text: wish.message,
    speed: 48,
    delay: isTypewriter ? 2600 : 0,
    enabled: isTypewriter,
  })
  const { displayed: typedFrom } = useTypewriter({
    text: `— ${wish.senderName}`,
    speed: 60,
    delay: isTypewriter ? 2600 + wish.message.length * 50 + 500 : 0,
    enabled: isTypewriter,
  })

  useEffect(() => {
    // ── Ink drop particles ────────────────────────────────────────
    const inkLayer = inkLayerRef.current!
    INK_DROPS.forEach(drop => {
      const el = document.createElement('div')
      Object.assign(el.style, {
        position: 'absolute',
        width: `${drop.size}px`,
        height: `${drop.size}px`,
        borderRadius: '50%',
        background: `hsla(${drop.hue}, 55%, 45%, 0.6)`,
        left: `${drop.x}%`,
        top: `${Math.random() * 100}%`,
        opacity: '0',
      })
      inkLayer.appendChild(el)

      gsap.to(el, {
        y: `${(Math.random() - 0.5) * 200}px`,
        x: `${(Math.random() - 0.5) * 100}px`,
        opacity: gsap.utils.random(0.3, 0.7),
        scale: gsap.utils.random(0.8, 2.2),
        duration: drop.dur,
        delay: drop.delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    // ── Ornament spin-in ─────────────────────────────────────────
    gsap.from(ornamentRef.current, {
      scale: 0,
      rotation: -90,
      opacity: 0,
      duration: 1.4,
      ease: 'elastic.out(1, 0.55)',
      delay: 0.2,
    })

    // ── Ornament slow rotate ─────────────────────────────────────
    gsap.to(ornamentRef.current, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
      delay: 1.8,
      transformOrigin: '50% 50%',
    })

    // ── Frame paint in ──────────────────────────────────────────
    gsap.from(frameRef.current, {
      opacity: 0,
      scale: 0.94,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.4,
    })

    // ── Label ──────────────────────────────────────────────────
    gsap.from(labelRef.current, {
      opacity: 0,
      y: -16,
      duration: 1,
      ease: 'power2.out',
      delay: 0.8,
    })

    // ── Name: ink brush strokes ────────────────────────────────
    const nameEl = nameRef.current!
    nameEl.innerHTML = wish.recipientName
      .split('')
      .map(c => `<span style="display:inline-block;will-change:transform,opacity,filter">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('')

    gsap.from(nameEl.querySelectorAll('span'), {
      opacity: 0,
      scaleY: 0,
      y: 40,
      transformOrigin: 'bottom center',
      skewY: gsap.utils.wrap([-5, 5]),
      filter: 'blur(8px)',
      stagger: { each: 0.06, from: 'start' },
      duration: 0.8,
      ease: 'power4.out',
      delay: 1.1,
    })

    // ── Brushstroke paths draw in ──────────────────────────────
    const strokePaths = canvasRef.current!.querySelectorAll('.bs')
    strokePaths.forEach((path, i) => {
      const len = (path as SVGPathElement).getTotalLength?.() ?? 300
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2 + i * 0.4,
        delay: 0.5 + i * 0.3,
        ease: 'power2.inOut',
      })
    })

    // ── Divider ────────────────────────────────────────────────
    gsap.from(dividerRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 2,
      transformOrigin: 'center',
    })

    // ── Message + from ─────────────────────────────────────────
    if (!isTypewriter) {
      gsap.from(msgRef.current, { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out', delay: 2.3 })
      gsap.from(fromRef.current, { opacity: 0, duration: 0.9, ease: 'power2.out', delay: 3.1 })
    } else {
      gsap.set([msgRef.current, fromRef.current], { opacity: 0 })
      gsap.to(msgRef.current, { opacity: 1, duration: 0.6, delay: 2.5 })
      gsap.to(fromRef.current, { opacity: 1, duration: 0.6, delay: 2.7 })
    }
  }, [wish, isTypewriter])

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#1a1208',
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(120,70,30,0.35) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(80,40,100,0.25) 0%, transparent 55%),
          radial-gradient(ellipse at 60% 10%, rgba(60,90,50,0.2) 0%, transparent 45%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Fraunces', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,500&family=DM+Sans:wght@300;400&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes breathe { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes texturePan { 0%{background-position:0 0} 100%{background-position:200px 200px} }
      `}</style>

      {/* Canvas background texture (noise pattern via repeating gradient) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.012) 0px,
            rgba(255,255,255,0.012) 1px,
            transparent 1px,
            transparent 8px
          ),
          repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.008) 0px,
            rgba(255,255,255,0.008) 1px,
            transparent 1px,
            transparent 8px
          )
        `,
        animation: 'texturePan 40s linear infinite',
        pointerEvents: 'none',
        opacity: 0.6,
      }} />

      {/* Background brushstroke SVG */}
      <svg
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 680 760"
        preserveAspectRatio="xMidYMid slice"
      >
        {BRUSHSTROKES.map((s, i) => (
          <path
            key={i}
            className="bs"
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={s.w}
            strokeLinecap="round"
          />
        ))}
        {/* Large arc flourishes */}
        <path className="bs" d="M-40,300 Q180,100 340,220 T720,180" fill="none" stroke="rgba(160,100,50,0.09)" strokeWidth="1.5" strokeLinecap="round" />
        <path className="bs" d="M-40,500 Q200,380 400,460 T740,400" fill="none" stroke="rgba(100,60,130,0.08)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Ink drop layer */}
      <div ref={inkLayerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(12,8,4,0.75) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '2.5rem 2rem', maxWidth: '560px' }}>

        {/* Art Nouveau Ornament — SVG mandala */}
        <svg
          ref={ornamentRef}
          width="72" height="72"
          viewBox="0 0 72 72"
          style={{ marginBottom: '1.5rem', transformOrigin: '36px 36px' }}
        >
          {/* Outer petals */}
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx="36" cy="18"
              rx="3" ry="8"
              fill="none"
              stroke="rgba(200,150,70,0.55)"
              strokeWidth="0.8"
              transform={`rotate(${i * 45} 36 36)`}
            />
          ))}
          {/* Mid ring */}
          <circle cx="36" cy="36" r="14" fill="none" stroke="rgba(200,150,70,0.3)" strokeWidth="0.6" strokeDasharray="3 3" />
          {/* Inner petals */}
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={i}
              cx="36" cy="26"
              rx="2" ry="6"
              fill="rgba(200,150,70,0.2)"
              stroke="rgba(200,150,70,0.4)"
              strokeWidth="0.5"
              transform={`rotate(${i * 60} 36 36)`}
            />
          ))}
          {/* Center */}
          <circle cx="36" cy="36" r="4" fill="rgba(200,150,70,0.5)" />
          <circle cx="36" cy="36" r="2" fill="rgba(240,200,100,0.8)" />
        </svg>

        {/* Label */}
        <p
          ref={labelRef}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '0.62rem',
            color: 'rgba(200,150,70,0.55)',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          Happy Birthday
        </p>

        {/* Picture frame border */}
        <div
          ref={frameRef}
          style={{
            position: 'relative',
            padding: '2.5rem 2rem',
            borderTop: '1px solid rgba(200,150,70,0.2)',
            borderBottom: '1px solid rgba(200,150,70,0.2)',
            marginBottom: '0.5rem',
          }}
        >
          {/* Corner ornaments — SVG */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos, i) => (
            <svg
              key={pos}
              width="18" height="18" viewBox="0 0 18 18"
              style={{
                position: 'absolute',
                top: i < 2 ? '-1px' : 'auto',
                bottom: i >= 2 ? '-1px' : 'auto',
                left: i % 2 === 0 ? '-1px' : 'auto',
                right: i % 2 === 1 ? '-1px' : 'auto',
                opacity: 0.55,
              }}
            >
              <path
                d={[
                  'M0 8 L0 0 L8 0',
                  'M18 8 L18 0 L10 0',
                  'M0 10 L0 18 L8 18',
                  'M18 10 L18 18 L10 18',
                ][i]}
                fill="none"
                stroke="rgba(200,150,70,0.8)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          ))}

          {/* Name */}
          <div
            ref={nameRef}
            style={{
              fontSize: 'clamp(2.8rem, 9vw, 5.5rem)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#e8c870',
              lineHeight: 1.0,
              textShadow: '0 2px 40px rgba(200,140,50,0.3)',
              letterSpacing: '-0.02em',
              animation: 'breathe 4s ease-in-out infinite',
            }}
          />
        </div>

        {/* Artistic divider */}
        <div
          ref={dividerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '1.75rem 0',
          }}
        >
          <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(90deg, transparent, rgba(200,150,70,0.4))' }} />
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 1 L13 8 L20 8 L14.5 12.5 L16.5 19.5 L10 15.5 L3.5 19.5 L5.5 12.5 L0 8 L7 8 Z" fill="none" stroke="rgba(200,150,70,0.6)" strokeWidth="0.8" />
          </svg>
          <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(90deg, rgba(200,150,70,0.4), transparent)' }} />
        </div>

        {/* Message */}
        <div
          ref={msgRef}
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.05rem, 2.8vw, 1.3rem)',
            color: 'rgba(230,200,150,0.82)',
            lineHeight: 1.9,
            marginBottom: '2rem',
            minHeight: isTypewriter ? '5em' : 'auto',
          }}
        >
          {isTypewriter ? typedMsg : wish.message}
          {isTypewriter && (
            <span style={{ borderRight: '2px solid rgba(200,150,70,0.8)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
          )}
        </div>

        {/* From */}
        <div
          ref={fromRef}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '0.75rem',
            color: 'rgba(200,150,70,0.45)',
            letterSpacing: '0.2em',
            fontStyle: 'normal',
          }}
        >
          {isTypewriter ? typedFrom : `— ${wish.senderName}`}
        </div>

        {/* Footer flourish */}
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '16px', opacity: 0.3 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <svg key={i} width="8" height="8" viewBox="0 0 8 8">
              <polygon
                points="4,0 5.5,2.5 8,3 6,5.5 6.5,8 4,6.8 1.5,8 2,5.5 0,3 2.5,2.5"
                fill="rgba(200,150,70,0.8)"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}
