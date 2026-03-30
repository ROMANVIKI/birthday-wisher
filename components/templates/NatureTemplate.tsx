'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Wish } from '@/types'

interface Props { wish: Wish }

// SVG leaf particle instead of emoji
const LEAF_PATHS = [
  'M10 2 Q14 6 10 14 Q6 6 10 2Z',
  'M2 10 Q8 4 14 10 Q8 16 2 10Z',
  'M10 0 Q18 5 14 14 Q6 14 2 5 Q6 0 10 0Z',
]

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

    const spawnLeaf = () => {
      const ns = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(ns, 'svg')
      svg.setAttribute('viewBox', '0 0 20 20')
      const size = 12 + Math.random() * 14
      const path = document.createElementNS(ns, 'path')
      path.setAttribute('d', LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)])
      const hue = 90 + Math.random() * 40
      path.setAttribute('fill', `hsl(${hue}, 55%, 58%)`)
      svg.appendChild(path)
      Object.assign(svg.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: '-20px',
        opacity: '0',
        pointerEvents: 'none',
      })
      petalLayer.appendChild(svg)

      gsap.to(svg, {
        y: `${window.innerHeight + 40}px`,
        x: `${(Math.random() - 0.5) * 140}px`,
        rotation: gsap.utils.random(-360, 360),
        opacity: gsap.utils.random(0.4, 0.85),
        duration: gsap.utils.random(5, 10),
        ease: 'none',
        onComplete: () => svg.remove(),
      })
    }

    for (let i = 0; i < 12; i++) setTimeout(() => spawnLeaf(), i * 220)
    const interval = setInterval(spawnLeaf, 650)

    // Animations
    const tl = gsap.timeline()

    tl.from(ornamentRef.current, {
      scale: 0, opacity: 0, rotation: -180,
      duration: 1.1, ease: 'elastic.out(1, 0.5)',
    }, 0.3)

    const nameEl = nameRef.current!
    const words = wish.recipientName.split(' ')
    nameEl.innerHTML = words
      .map(w => `<span style="display:inline-block;overflow:hidden;padding-bottom:0.05em"><span class="word-inner" style="display:inline-block">${w}</span></span>`)
      .join(' ')

    tl.from(nameEl.querySelectorAll('.word-inner'), {
      y: '110%', opacity: 0,
      duration: 0.9, stagger: 0.18, ease: 'power4.out',
    }, 0.8)

    tl.from(subtitleRef.current, { opacity: 0, y: 15, duration: 0.8, ease: 'power2.out' }, 1.5)
    tl.from(dividerRef.current, { scaleX: 0, opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.8)

    if (!isTypewriter) {
      tl.from(msgRef.current, { opacity: 0, y: 20, duration: 1, ease: 'power3.out' }, 2.0)
      tl.from(fromRef.current, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 2.7)
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: "'Fraunces', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <div ref={petalLayerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }} />

      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(143,188,106,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2.5rem 2rem', maxWidth: '540px' }}>

        {/* SVG botanical ornament */}
        <div ref={ornamentRef} style={{ marginBottom: '1.5rem' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3 Q22 9 16 20 Q10 9 16 3Z" fill="#8fbc6a" opacity="0.9" />
            <path d="M3 16 Q9 10 20 16 Q9 22 3 16Z" fill="#8fbc6a" opacity="0.6" />
            <circle cx="16" cy="16" r="2" fill="#8fbc6a" opacity="0.8" />
          </svg>
        </div>

        <div
          ref={nameRef}
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 5rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#c8e6a0',
            lineHeight: 1.1,
            marginBottom: '0.75rem',
            textShadow: '0 2px 30px rgba(143,188,106,0.25)',
          }}
        />

        <div ref={subtitleRef} style={{
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          color: '#8fbc6a',
          letterSpacing: '0.08em',
          marginBottom: '1.75rem',
        }}>
          Happy Birthday, dear one
        </div>

        <div
          ref={dividerRef}
          style={{
            width: '80px', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(143,188,106,0.5), transparent)',
            margin: '0 auto 1.75rem', transformOrigin: 'center',
          }}
        />

        <div
          ref={msgRef}
          style={{
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.05rem, 2.8vw, 1.3rem)',
            color: 'rgba(200,230,160,0.8)',
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
            fontSize: '0.75rem',
            color: 'rgba(143,188,106,0.5)',
            letterSpacing: '0.2em',
          }}
        >
          {isTypewriter ? typedFrom : `— ${wish.senderName}`}
        </div>

        {/* Botanical footer */}
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '12px', opacity: 0.3 }}>
          {[0, 1, 2].map(i => (
            <svg key={i} width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="2" fill="#8fbc6a" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}
