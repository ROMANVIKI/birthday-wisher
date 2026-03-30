'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Wish } from '@/types'

interface Props { wish: Wish }

const PETALS = ['🌸', '🌺', '🌼', '🍀', '🌻', '🌷', '✿', '❀']

export function NatureTemplate({ wish }: Props) {
  const petalLayerRef = useRef<HTMLDivElement>(null)
  const ornamentRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)

  const isTypewriter = wish.textEffect === 'typewriter'

  const { displayed: typedMsg } = useTypewriter({
    text: wish.message,
    speed: 45,
    delay: isTypewriter ? 2400 : 0,
    enabled: isTypewriter,
  })
  const { displayed: typedFrom } = useTypewriter({
    text: `— ${wish.senderName}`,
    speed: 60,
    delay: isTypewriter ? 2400 + wish.message.length * 47 + 400 : 0,
    enabled: isTypewriter,
  })

  useEffect(() => {
    const petalLayer = petalLayerRef.current!

    // ── Spawn falling petals ──────────────────────────────────────
    const spawnPetal = () => {
      const el = document.createElement('span')
      el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)]
      const size = gsap.utils.random(0.9, 1.8)
      Object.assign(el.style, {
        position: 'absolute',
        fontSize: `${size}rem`,
        left: `${Math.random() * 100}%`,
        top: '-40px',
        opacity: '0',
        pointerEvents: 'none',
        userSelect: 'none',
      })
      petalLayer.appendChild(el)

      gsap.to(el, {
        y: `${window.innerHeight + 60}px`,
        x: `${(Math.random() - 0.5) * 160}px`,
        rotation: gsap.utils.random(-360, 360),
        opacity: gsap.utils.random(0.5, 0.9),
        duration: gsap.utils.random(5, 10),
        delay: 0,
        ease: 'none',
        onComplete: () => {
          el.remove()
        },
      })
    }

    // Initial burst
    for (let i = 0; i < 14; i++) {
      setTimeout(() => spawnPetal(), i * 200)
    }

    // Continuous rain
    const interval = setInterval(spawnPetal, 600)

    // ── Content animations ────────────────────────────────────────
    const tl = gsap.timeline()

    tl.from(ornamentRef.current, {
      scale: 0,
      opacity: 0,
      rotation: -180,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
    }, 0.3)

    // Name: word by word for nature feel
    const nameEl = nameRef.current!
    const words = wish.recipientName.split(' ')
    nameEl.innerHTML = words
      .map(w => `<span style="display:inline-block;overflow:hidden;padding-bottom:0.05em"><span class="word-inner" style="display:inline-block">${w}</span></span>`)
      .join(' ')

    tl.from(nameEl.querySelectorAll('.word-inner'), {
      y: '110%',
      opacity: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power4.out',
    }, 0.8)

    tl.from(subtitleRef.current, {
      opacity: 0,
      y: 15,
      duration: 0.8,
      ease: 'power2.out',
    }, 1.5)

    tl.from(dividerRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    }, 1.8)

    if (!isTypewriter) {
      tl.from(msgRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
      }, 2.0)
      tl.from(fromRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 2.7)
    } else {
      gsap.set([msgRef.current, fromRef.current], { opacity: 0 })
      gsap.to(msgRef.current, { opacity: 1, duration: 0.5, delay: 2.2 })
      gsap.to(fromRef.current, { opacity: 1, duration: 0.5, delay: 2.4 })
    }

    return () => clearInterval(interval)
  }, [wish, isTypewriter])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #1a4020 0%, #0d2010 50%, #060d07 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      {/* Petal layer */}
      <div
        ref={petalLayerRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}
      />

      {/* Soft light radials */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(143,188,106,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2.5rem 2rem', maxWidth: '540px' }}>

        <div
          ref={ornamentRef}
          style={{ fontSize: '2rem', marginBottom: '1.25rem', color: '#8fbc6a', filter: 'drop-shadow(0 0 8px rgba(143,188,106,0.5))' }}
        >
          ❧
        </div>

        <div
          ref={nameRef}
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 5rem)',
            fontWeight: 600,
            color: '#c8e6a0',
            lineHeight: 1.1,
            marginBottom: '0.75rem',
            textShadow: '0 2px 30px rgba(143,188,106,0.3)',
          }}
        />

        <div
          ref={subtitleRef}
          style={{
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: '#8fbc6a',
            letterSpacing: '0.08em',
            marginBottom: '1.75rem',
          }}
        >
          Happy Birthday, dear one
        </div>

        <div
          ref={dividerRef}
          style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(143,188,106,0.6), transparent)',
            margin: '0 auto 1.75rem',
            transformOrigin: 'center',
          }}
        />

        <div
          ref={msgRef}
          style={{
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.05rem, 2.8vw, 1.3rem)',
            color: 'rgba(200,230,160,0.82)',
            lineHeight: 1.85,
            marginBottom: '2rem',
            minHeight: isTypewriter ? '5em' : 'auto',
          }}
        >
          {isTypewriter ? typedMsg : wish.message}
          {isTypewriter && (
            <span style={{ borderRight: '2px solid rgba(143,188,106,0.8)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
          )}
        </div>

        <div
          ref={fromRef}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '0.78rem',
            color: 'rgba(143,188,106,0.5)',
            letterSpacing: '0.2em',
          }}
        >
          {isTypewriter ? typedFrom : `— ${wish.senderName}`}
        </div>

        <div style={{ marginTop: '2.5rem', fontSize: '1.2rem', color: 'rgba(143,188,106,0.3)' }}>✦ ✦ ✦</div>
      </div>
    </div>
  )
}
