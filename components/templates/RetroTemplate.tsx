'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Wish } from '@/types'

interface Props { wish: Wish }

export function RetroTemplate({ wish }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const glitchRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const chromaARef = useRef<HTMLDivElement>(null)
  const chromaBRef = useRef<HTMLDivElement>(null)

  const isTypewriter = wish.textEffect === 'typewriter'

  const { displayed: typedMsg } = useTypewriter({
    text: wish.message,
    speed: 35,
    delay: isTypewriter ? 2400 : 0,
    enabled: isTypewriter,
  })
  const { displayed: typedFrom } = useTypewriter({
    text: `// from ${wish.senderName}`,
    speed: 50,
    delay: isTypewriter ? 2400 + wish.message.length * 37 + 400 : 0,
    enabled: isTypewriter,
  })

  useEffect(() => {
    const tl = gsap.timeline()

    // Grid perspective drift
    gsap.to(gridRef.current, {
      backgroundPositionX: '+=120px',
      backgroundPositionY: '+=120px',
      duration: 16,
      repeat: -1,
      ease: 'none',
    })

    // Scanline sweep
    gsap.to(scanlineRef.current, {
      y: '110vh',
      duration: 4.5,
      repeat: -1,
      ease: 'none',
      delay: 1,
    })

    // Label glitch in
    tl.from(labelRef.current, {
      opacity: 0,
      skewX: 8,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.3)

    // Name: letters slam in with chromatic aberration
    const nameEl = nameRef.current!
    nameEl.innerHTML = wish.recipientName
      .split('')
      .map(c =>
        `<span style="display:inline-block;will-change:transform,opacity,filter">${c === ' ' ? '&nbsp;' : c}</span>`
      )
      .join('')

    tl.from(nameEl.querySelectorAll('span'), {
      opacity: 0,
      y: -80,
      scaleY: 2.5,
      skewX: gsap.utils.wrap([-12, 12]),
      filter: 'blur(12px)',
      stagger: { each: 0.055, from: 'random' },
      duration: 0.6,
      ease: 'expo.out',
    }, 0.5)

    // Chroma split: two ghost layers offset R and B
    tl.from([chromaARef.current, chromaBRef.current], {
      opacity: 0,
      duration: 0.3,
    }, 0.5)
    gsap.to(chromaARef.current, {
      x: 4, y: -2,
      duration: 0.08,
      repeat: 3,
      yoyo: true,
      delay: 0.9,
    })
    gsap.to(chromaBRef.current, {
      x: -4, y: 2,
      duration: 0.08,
      repeat: 3,
      yoyo: true,
      delay: 0.9,
    })

    // Occasional random glitch
    const glitchLoop = () => {
      const delay = 3 + Math.random() * 8
      setTimeout(() => {
        if (!nameEl) return
        const glitchTl = gsap.timeline()
        glitchTl
          .to(nameEl, { skewX: gsap.utils.random(-6, 6), duration: 0.06 })
          .to(chromaARef.current, { x: gsap.utils.random(4, 9), duration: 0.04 }, '<')
          .to(chromaBRef.current, { x: gsap.utils.random(-9, -4), duration: 0.04 }, '<')
          .to(nameEl, { skewX: 0, duration: 0.06 })
          .to([chromaARef.current, chromaBRef.current], { x: 0, duration: 0.04 }, '<')
        glitchLoop()
      }, delay * 1000)
    }
    glitchLoop()

    // Glitch bar flash
    gsap.set(glitchRef.current, { opacity: 0 })
    const flashGlitch = () => {
      setTimeout(() => {
        if (!glitchRef.current) return
        gsap.set(glitchRef.current, {
          top: `${20 + Math.random() * 60}%`,
          height: `${2 + Math.random() * 8}px`,
          opacity: 1,
        })
        gsap.to(glitchRef.current, { opacity: 0, duration: 0.12 })
        flashGlitch()
      }, (2 + Math.random() * 7) * 1000)
    }
    flashGlitch()

    // Message & from
    if (!isTypewriter) {
      tl.from(msgRef.current, {
        opacity: 0,
        y: 20,
        skewX: 3,
        duration: 0.9,
        ease: 'power3.out',
      }, 1.8)
      tl.from(fromRef.current, {
        opacity: 0,
        duration: 0.7,
      }, 2.5)
    } else {
      gsap.set([msgRef.current, fromRef.current], { opacity: 0 })
      gsap.to(msgRef.current, { opacity: 1, duration: 0.5, delay: 2.2 })
      gsap.to(fromRef.current, { opacity: 1, duration: 0.5, delay: 2.4 })
    }
  }, [wish, isTypewriter])

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg,#05000e,#0e0020,#05000e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Fraunces', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Mono:wght@300;400&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes rgbCycle {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes phosphor {
          0%,100% { opacity: 0.85; }
          50%     { opacity: 1; }
        }
      `}</style>

      {/* Grid floor */}
      <div
        ref={gridRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,45,120,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,45,120,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(600px) rotateX(30deg) translateY(40%)',
          transformOrigin: 'center bottom',
          pointerEvents: 'none',
        }}
      />

      {/* Radial vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,0,14,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal scanline */}
      <div
        ref={scanlineRef}
        style={{
          position: 'absolute',
          left: 0, right: 0,
          top: '-4%',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(255,45,120,0.12), transparent)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Glitch bar */}
      <div
        ref={glitchRef}
        style={{
          position: 'absolute',
          left: 0, right: 0,
          height: '4px',
          background: 'rgba(0,245,255,0.3)',
          pointerEvents: 'none',
          zIndex: 4,
          mixBlendMode: 'screen',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '2rem', maxWidth: '600px' }}>

        {/* Label */}
        <p
          ref={labelRef}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 300,
            fontSize: '0.62rem',
            color: 'rgba(255,45,120,0.7)',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            marginBottom: '1.75rem',
          }}
        >
          {'>>> HAPPY_BIRTHDAY.exe'}
        </p>

        {/* Name with chroma layers */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2.5rem' }}>
          {/* Chroma A — cyan offset */}
          <div
            ref={chromaARef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              fontSize: 'clamp(3rem, 10vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: 'rgba(0,245,255,0.25)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              transform: 'translateX(3px) translateY(-2px)',
              fontFamily: "'Fraunces', serif",
            }}
          >
            {wish.recipientName}
          </div>
          {/* Chroma B — magenta offset */}
          <div
            ref={chromaBRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              fontSize: 'clamp(3rem, 10vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: 'rgba(255,45,120,0.25)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              transform: 'translateX(-3px) translateY(2px)',
              fontFamily: "'Fraunces', serif",
            }}
          >
            {wish.recipientName}
          </div>
          {/* Main name */}
          <div
            ref={nameRef}
            style={{
              fontSize: 'clamp(3rem, 10vw, 6.5rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1,
              position: 'relative',
              textShadow: '0 0 40px rgba(255,45,120,0.4), 0 0 80px rgba(0,245,255,0.2)',
              animation: 'phosphor 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Horizontal rule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '2rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,45,120,0.4))' }} />
          {/* SVG diamond — no emoji */}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,5 5,10 0,5" fill="rgba(255,45,120,0.7)" />
          </svg>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,45,120,0.4), transparent)' }} />
        </div>

        {/* Message */}
        <div
          ref={msgRef}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 300,
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'rgba(0,245,255,0.85)',
            lineHeight: 1.9,
            marginBottom: '2rem',
            minHeight: isTypewriter ? '5em' : 'auto',
            letterSpacing: '0.02em',
          }}
        >
          {isTypewriter ? typedMsg : wish.message}
          {isTypewriter && (
            <span style={{ borderRight: '2px solid rgba(0,245,255,0.8)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
          )}
        </div>

        {/* From */}
        <div
          ref={fromRef}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 300,
            fontSize: '0.72rem',
            color: 'rgba(255,45,120,0.55)',
            letterSpacing: '0.15em',
          }}
        >
          {isTypewriter ? typedFrom : `// from ${wish.senderName}`}
        </div>

        {/* Corner decorations — SVG brackets */}
        <svg
          width="24" height="24" viewBox="0 0 24 24"
          style={{ position: 'absolute', top: '1rem', left: '1rem', opacity: 0.3 }}
        >
          <path d="M12 2H4V12" fill="none" stroke="#ff2d78" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg
          width="24" height="24" viewBox="0 0 24 24"
          style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.3 }}
        >
          <path d="M12 2H20V12" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg
          width="24" height="24" viewBox="0 0 24 24"
          style={{ position: 'absolute', bottom: '1rem', left: '1rem', opacity: 0.3 }}
        >
          <path d="M12 22H4V12" fill="none" stroke="#ff2d78" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg
          width="24" height="24" viewBox="0 0 24 24"
          style={{ position: 'absolute', bottom: '1rem', right: '1rem', opacity: 0.3 }}
        >
          <path d="M12 22H20V12" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
