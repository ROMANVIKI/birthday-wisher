'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Wish } from '@/types'

interface Props { wish: Wish }

export function StarfallTemplate({ wish }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLParagraphElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  const isTypewriter = wish.textEffect === 'typewriter'

  const { displayed: typedMsg } = useTypewriter({
    text: wish.message,
    speed: 40,
    delay: isTypewriter ? 2200 : 0,
    enabled: isTypewriter,
  })
  const { displayed: typedFrom } = useTypewriter({
    text: `— with love, ${wish.senderName}`,
    speed: 55,
    delay: isTypewriter ? 2200 + wish.message.length * 42 + 400 : 0,
    enabled: isTypewriter,
  })

  useEffect(() => {
    const canvas = canvasRef.current!

    // Star particles
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div')
      const size = Math.random() * 2.5 + 0.5
      const isGold = Math.random() > 0.72
      Object.assign(star.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: isGold ? '#f0c040' : '#ffffff',
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 20 + 5}px`,
        opacity: '0',
      })
      canvas.appendChild(star)
      gsap.to(star, {
        y: `${110 + Math.random() * 20}vh`,
        x: `${(Math.random() - 0.5) * 120}px`,
        rotation: gsap.utils.random(180, 720),
        opacity: gsap.utils.random(0.3, 0.9),
        duration: gsap.utils.random(4, 9),
        delay: gsap.utils.random(0, 6),
        repeat: -1,
        ease: 'none',
        onRepeat: () => {
          gsap.set(star, { y: 0, x: 0, opacity: 0, left: `${Math.random() * 100}%` })
        },
      })
    }

    // Orb pulse
    gsap.to(orbRef.current, { scale: 1.15, opacity: 0.6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    // Label
    gsap.from(labelRef.current, { opacity: 0, y: -18, duration: 1, ease: 'power2.out', delay: 0.3 })

    // Divider
    gsap.from(dividerRef.current, { scaleX: 0, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 })

    // Name characters
    const nameEl = nameRef.current!
    nameEl.innerHTML = wish.recipientName
      .split('')
      .map(c => `<span style="display:inline-block;will-change:transform,opacity">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('')

    gsap.from(nameEl.querySelectorAll('span'), {
      opacity: 0, y: 60, rotateX: -90, scale: 0.5,
      stagger: 0.07, duration: 0.75, ease: 'back.out(2)', delay: 0.7,
    })

    if (!isTypewriter) {
      gsap.from(msgRef.current, { opacity: 0, y: 30, duration: 1.2, ease: 'power3.out', delay: 1.8 })
      gsap.from(fromRef.current, { opacity: 0, y: 20, duration: 1.0, ease: 'power3.out', delay: 2.4 })
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
        background: 'radial-gradient(ellipse at 50% 40%, #18103a 0%, #090b1a 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: "'Fraunces', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <div ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div
        ref={orbRef}
        style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,192,64,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none', opacity: 0.4,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2rem', maxWidth: '560px' }}>

        <p ref={labelRef} style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: '0.68rem',
          color: 'rgba(240,192,64,0.55)',
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          Happy Birthday
        </p>

        <div
          ref={dividerRef}
          style={{
            width: '24px', height: '1px',
            background: 'rgba(240,192,64,0.35)',
            margin: '0 auto 1.5rem',
            transformOrigin: 'center',
          }}
        />

        <div
          ref={nameRef}
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#f0c040',
            lineHeight: 1.0,
            marginBottom: '2.5rem',
            textShadow: '0 0 80px rgba(240,192,64,0.25)',
            perspective: '600px',
          }}
        />

        <div style={{
          width: '48px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(240,192,64,0.4), transparent)',
          margin: '0 auto 2rem',
        }} />

        <div
          ref={msgRef}
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.05rem, 3vw, 1.35rem)',
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.85,
            marginBottom: '2rem',
            minHeight: isTypewriter ? '4em' : 'auto',
          }}
        >
          {isTypewriter ? typedMsg : wish.message}
          {isTypewriter && (
            <span style={{ borderRight: '2px solid rgba(240,192,64,0.7)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
          )}
        </div>

        <p
          ref={fromRef}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.32)',
            letterSpacing: '0.15em',
          }}
        >
          {isTypewriter ? typedFrom : `— with love, ${wish.senderName}`}
        </p>
      </div>
    </div>
  )
}
