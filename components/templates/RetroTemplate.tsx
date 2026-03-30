'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Wish } from '@/types'

interface Props { wish: Wish }

export function RetroTemplate({ wish }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const bdayRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const isTypewriter = wish.textEffect === 'typewriter'

  const { displayed: typedMsg } = useTypewriter({
    text: wish.message,
    speed: 35,
    delay: isTypewriter ? 2000 : 0,
    enabled: isTypewriter,
  })
  const { displayed: typedFrom } = useTypewriter({
    text: `— ${wish.senderName}`,
    speed: 60,
    delay: isTypewriter ? 2000 + wish.message.length * 37 + 500 : 0,
    enabled: isTypewriter,
  })

  useEffect(() => {
    const tl = gsap.timeline()

    // Grid scrolling animation
    gsap.to(gridRef.current, {
      backgroundPositionY: '80px',
      duration: 2,
      repeat: -1,
      ease: 'none',
    })

    // Label flies in from bottom
    tl.from(labelRef.current, {
      y: 40, opacity: 0, duration: 0.6, ease: 'power3.out',
    }, 0.2)

    // Name glitch-slam entrance
    tl.from(nameRef.current, {
      scaleX: 0,
      skewX: 25,
      opacity: 0,
      duration: 0.5,
      ease: 'power4.out',
    }, 0.6)

    // Glitch effect on name (repeating)
    gsap.to(nameRef.current, {
      skewX: 4,
      duration: 0.08,
      repeat: 3,
      yoyo: true,
      ease: 'power4.inOut',
      delay: 1.2,
    })

    // Birthday text
    tl.from(bdayRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power2.out',
    }, 1.0)

    // Neon flicker on birthday text
    gsap.to(bdayRef.current, {
      textShadow: [
        '0 0 10px #ff2d78, 0 0 20px #ff2d78',
        '0 0 2px #ff2d78',
        '0 0 10px #ff2d78, 0 0 20px #ff2d78',
      ].join(','),
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      delay: 1.5,
    })

    // Message
    if (!isTypewriter) {
      tl.from(msgRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      }, 1.4)
      tl.from(fromRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, 1.9)
    } else {
      gsap.set([msgRef.current, fromRef.current], { opacity: 0 })
      gsap.to(msgRef.current, { opacity: 1, duration: 0.3, delay: 2.0 })
      gsap.to(fromRef.current, { opacity: 1, duration: 0.3, delay: 2.2 })
    }

    // Scanline flicker loop
    const scanInterval = setInterval(() => {
      if (Math.random() > 0.85 && containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0.88, duration: 0.05, yoyo: true, repeat: 1,
        })
      }
    }, 3000)

    return () => clearInterval(scanInterval)
  }, [wish, isTypewriter])

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#07000f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Bebas Neue', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanMove { 0%{top:-10%} 100%{top:110%} }
      `}</style>

      {/* Perspective grid */}
      <div
        ref={gridRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,45,120,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,120,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(400px) rotateX(25deg) scaleY(1.4)',
          transformOrigin: '50% 100%',
          pointerEvents: 'none',
        }}
      />

      {/* Scanlines overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 2px)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Scan beam */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg,transparent,rgba(0,245,255,0.15),transparent)',
          animation: 'scanMove 6s linear infinite',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,120,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '2rem', maxWidth: '580px' }}>

        <div
          ref={labelRef}
          style={{
            fontSize: '0.8rem',
            color: '#00f5ff',
            letterSpacing: '0.45em',
            marginBottom: '1rem',
            textShadow: '0 0 12px rgba(0,245,255,0.6)',
          }}
        >
          ◈ IT'S TIME TO CELEBRATE ◈
        </div>

        <div
          ref={nameRef}
          style={{
            fontSize: 'clamp(3rem, 12vw, 7rem)',
            lineHeight: 1,
            marginBottom: '0.25rem',
            background: 'linear-gradient(135deg, #ff2d78 30%, #00f5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 24px rgba(255,45,120,0.5))',
          }}
        >
          {wish.recipientName}
        </div>

        <div
          ref={bdayRef}
          style={{
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            color: '#ff2d78',
            letterSpacing: '0.3em',
            marginBottom: '2rem',
            textShadow: '0 0 12px #ff2d78, 0 0 30px rgba(255,45,120,0.4)',
          }}
        >
          HAPPY BIRTHDAY!
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem', justifyContent: 'center' }}>
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(0,245,255,0.4))' }} />
          <span style={{ fontSize: '0.7rem', color: 'rgba(0,245,255,0.5)', letterSpacing: '0.2em' }}>✦</span>
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(90deg,rgba(0,245,255,0.4),transparent)' }} />
        </div>

        <div
          ref={msgRef}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
            color: 'rgba(0,245,255,0.75)',
            lineHeight: 1.8,
            marginBottom: '1.5rem',
            minHeight: isTypewriter ? '5em' : 'auto',
          }}
        >
          {isTypewriter ? typedMsg : wish.message}
          {isTypewriter && (
            <span style={{ borderRight: '2px solid #00f5ff', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
          )}
        </div>

        <div
          ref={fromRef}
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,45,120,0.5)',
            letterSpacing: '0.3em',
          }}
        >
          {isTypewriter ? typedFrom : `— ${wish.senderName}`}
        </div>
      </div>
    </div>
  )
}
