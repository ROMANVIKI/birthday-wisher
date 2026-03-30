'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'
import type { Wish } from '@/types'

interface Props { wish: Wish }

export function MinimalTemplate({ wish }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const topLineRef = useRef<HTMLDivElement>(null)
  const botLineRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const msgRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  const isTypewriter = wish.textEffect === 'typewriter'

  const { displayed: typedMsg } = useTypewriter({
    text: wish.message,
    speed: 50,
    delay: isTypewriter ? 2600 : 0,
    enabled: isTypewriter,
  })
  const { displayed: typedFrom } = useTypewriter({
    text: wish.senderName,
    speed: 65,
    delay: isTypewriter ? 2600 + wish.message.length * 52 + 500 : 0,
    enabled: isTypewriter,
  })

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from([topLineRef.current, botLineRef.current], {
      scaleX: 0, transformOrigin: 'center',
      duration: 1.4, ease: 'expo.out',
    }, 0)

    tl.from(yearRef.current, { opacity: 0, duration: 0.8 }, 0.6)

    const nameEl = nameRef.current!
    nameEl.innerHTML = wish.recipientName
      .split('')
      .map(c =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="char-slide" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span></span>`
      )
      .join('')

    tl.from(nameEl.querySelectorAll('.char-slide'), {
      y: '105%', opacity: 0,
      duration: 1.1, stagger: 0.055, ease: 'expo.out',
    }, 0.9)

    tl.from(subtitleRef.current, { opacity: 0, y: 12, duration: 0.9 }, 1.6)
    tl.from(dotRef.current, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 1.9)

    if (!isTypewriter) {
      tl.from(msgRef.current, { opacity: 0, y: 18, duration: 1.0 }, 2.1)
      tl.from(fromRef.current, { opacity: 0, y: 10, duration: 0.8 }, 2.8)
    } else {
      gsap.set([msgRef.current, fromRef.current], { opacity: 0 })
      gsap.to(msgRef.current, { opacity: 1, duration: 0.6, delay: 2.4 })
      gsap.to(fromRef.current, { opacity: 1, duration: 0.6, delay: 2.6 })
    }

    gsap.to(nameRef.current, {
      y: -3, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3,
    })
  }, [wish, isTypewriter])

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#f7f4ed',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: "'Fraunces', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <div ref={topLineRef} style={{ position: 'absolute', top: '18%', left: 0, right: 0, height: '0.5px', background: 'rgba(45,40,32,0.1)' }} />
      <div ref={botLineRef} style={{ position: 'absolute', bottom: '18%', left: 0, right: 0, height: '0.5px', background: 'rgba(45,40,32,0.1)' }} />

      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '500px', position: 'relative', zIndex: 1 }}>

        <div ref={yearRef} style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.62rem',
          fontWeight: 500,
          color: 'rgba(45,40,32,0.22)',
          letterSpacing: '0.55em',
          textTransform: 'uppercase',
          marginBottom: '3rem',
        }}>
          {new Date().getFullYear()}
        </div>

        <div
          ref={nameRef}
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#2d2820',
            lineHeight: 1,
            marginBottom: '1.25rem',
            perspective: '600px',
          }}
        />

        <div ref={subtitleRef} style={{
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: 'rgba(45,40,32,0.38)',
          letterSpacing: '0.06em',
          marginBottom: '3rem',
        }}>
          Happy Birthday
        </div>

        <div
          ref={dotRef}
          style={{
            width: '4px', height: '4px', borderRadius: '50%',
            background: 'rgba(45,40,32,0.22)',
            margin: '0 auto 3rem',
          }}
        />

        <div
          ref={msgRef}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 'clamp(0.88rem, 2.2vw, 1rem)',
            color: 'rgba(45,40,32,0.62)',
            lineHeight: 1.9,
            marginBottom: '3rem',
            minHeight: isTypewriter ? '5em' : 'auto',
          }}
        >
          {isTypewriter ? typedMsg : wish.message}
          {isTypewriter && (
            <span style={{ borderRight: '1.5px solid rgba(45,40,32,0.45)', marginLeft: '2px', animation: 'blink 1s step-end infinite' }} />
          )}
        </div>

        <div ref={fromRef} style={{
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
          color: 'rgba(45,40,32,0.32)',
        }}>
          {isTypewriter ? typedFrom : wish.senderName}
        </div>
      </div>
    </div>
  )
}
