'use client'
import { useState, useRef } from 'react'
import { nanoid } from 'nanoid'
import type { WishTemplate, MusicTrack, TextEffect } from '@/types'
import { MUSIC_LABELS, TEXT_EFFECT_LABELS } from '@/types'

const TEMPLATES: { id: WishTemplate; label: string; desc: string; preview: React.ReactNode }[] = [
  {
    id: 'starfall',
    label: 'Starfall',
    desc: 'Dark & golden',
    preview: (
      <div style={{ background: 'linear-gradient(160deg,#090b1a,#18103a)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ fontSize: '1.5rem' }}>✨</span>
        <span style={{ fontFamily: 'serif', fontSize: '0.7rem', color: '#f0c040', letterSpacing: '0.1em' }}>STARFALL</span>
      </div>
    ),
  },
  {
    id: 'retro',
    label: 'Retro',
    desc: 'Neon & grid',
    preview: (
      <div style={{ background: 'linear-gradient(160deg,#07000f,#1a0030)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,45,120,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,45,120,0.12) 1px,transparent 1px)', backgroundSize: '12px 12px' }} />
        <span style={{ fontSize: '1.5rem', position: 'relative' }}>⚡</span>
        <span style={{ fontFamily: 'sans-serif', fontSize: '0.65rem', color: '#ff2d78', letterSpacing: '0.1em', position: 'relative' }}>RETRO</span>
      </div>
    ),
  },
  {
    id: 'nature',
    label: 'Nature',
    desc: 'Botanical',
    preview: (
      <div style={{ background: 'linear-gradient(160deg,#0d2010,#1a3515)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ fontSize: '1.5rem' }}>🌿</span>
        <span style={{ fontFamily: 'serif', fontSize: '0.7rem', color: '#8fbc6a', letterSpacing: '0.1em' }}>NATURE</span>
      </div>
    ),
  },
  {
    id: 'minimal',
    label: 'Minimal',
    desc: 'Refined & clean',
    preview: (
      <div style={{ background: '#f7f4ed', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ fontSize: '1.2rem', color: '#2d2820' }}>◇</span>
        <span style={{ fontFamily: 'serif', fontSize: '0.7rem', color: 'rgba(45,40,32,0.5)', letterSpacing: '0.1em' }}>MINIMAL</span>
      </div>
    ),
  },
]

const MUSIC_OPTIONS: MusicTrack[] = ['lofi', 'jazz', 'orchestral', 'acoustic', 'none']
const MUSIC_ICONS: Record<MusicTrack, string> = {
  lofi: '🎹', jazz: '🎷', orchestral: '🎻', acoustic: '🎸', none: '🔇',
}

const TEXT_EFFECTS: TextEffect[] = ['reveal', 'typewriter', 'float']
const TEXT_EFFECT_ICONS: Record<TextEffect, string> = {
  reveal: '✨', typewriter: '⌨️', float: '🌊',
}

export default function WishForm() {
  const [form, setForm] = useState({
    recipientName: '',
    message: '',
    senderName: '',
    template: 'starfall' as WishTemplate,
    musicTrack: 'lofi' as MusicTrack,
    textEffect: 'reveal' as TextEffect,
  })
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const linkBoxRef = useRef<HTMLDivElement>(null)

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const generate = async () => {
    if (!form.recipientName.trim()) { alert('Please enter a recipient name'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: nanoid(10) }),
      })
      const { id } = await res.json()
      const url = `${window.location.origin}/wish/${id}`
      setLink(url)
      setTimeout(() => linkBoxRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, #1a1040 0%, #0d0d14 50%, #0d1a14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0.75rem 1rem; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
        input:focus, textarea:focus { border-color: rgba(240,192,64,0.45); background: rgba(255,255,255,0.07); }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        textarea { resize: none; height: 100px; line-height: 1.6; }
      `}</style>

      <div style={{ maxWidth: '620px', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            background: 'linear-gradient(135deg, #f0c040 0%, #e8547a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}>
            Birthday Wisher
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
            Create a magical birthday experience. Share the link.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '2rem',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>

          {/* Name */}
          <Field label="Recipient's Name">
            <input type="text" placeholder="e.g. Priya" maxLength={40} value={form.recipientName} onChange={e => set('recipientName', e.target.value)} />
          </Field>

          {/* Message */}
          <Field label="Your Message">
            <textarea placeholder="Write something heartfelt..." maxLength={400} value={form.message} onChange={e => set('message', e.target.value)} />
            <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>
              {form.message.length}/400
            </div>
          </Field>

          {/* From */}
          <Field label="From">
            <input type="text" placeholder="Your name" maxLength={40} value={form.senderName} onChange={e => set('senderName', e.target.value)} />
          </Field>

          {/* Templates */}
          <Field label="Template">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => set('template', t.id)}
                  style={{
                    background: 'transparent',
                    border: `2px solid ${form.template === t.id ? '#f0c040' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    aspectRatio: '4/3',
                    padding: 0,
                    transition: 'border-color 0.2s, transform 0.15s',
                    transform: form.template === t.id ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{ height: '100%' }}>{t.preview}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginTop: '8px' }}>
              {TEMPLATES.map(t => (
                <div key={t.id} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 500, color: form.template === t.id ? '#f0c040' : 'rgba(255,255,255,0.4)' }}>{t.label}</div>
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.2)' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </Field>

          {/* Text Effect */}
          <Field label="Text Animation Style">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
              {TEXT_EFFECTS.map(e => (
                <button
                  key={e}
                  onClick={() => set('textEffect', e)}
                  style={{
                    background: form.textEffect === e ? 'rgba(240,192,64,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.textEffect === e ? '#f0c040' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px',
                    padding: '0.65rem 0.5rem',
                    cursor: 'pointer',
                    color: form.textEffect === e ? '#f0c040' : 'rgba(255,255,255,0.5)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{TEXT_EFFECT_ICONS[e]}</span>
                  <span>{TEXT_EFFECT_LABELS[e]}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Music */}
          <Field label="Background Music">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px' }}>
              {MUSIC_OPTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => set('musicTrack', m)}
                  style={{
                    background: form.musicTrack === m ? 'rgba(240,192,64,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.musicTrack === m ? '#f0c040' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px',
                    padding: '0.6rem 0.8rem',
                    cursor: 'pointer',
                    color: form.musicTrack === m ? '#f0c040' : 'rgba(255,255,255,0.5)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{MUSIC_ICONS[m]}</span>
                  <span>{MUSIC_LABELS[m]}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* CTA */}
          <button
            onClick={generate}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #f0c040 0%, #e8547a 100%)',
              border: 'none',
              borderRadius: '14px',
              padding: '1rem',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: '#0d0d14',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'none' }}
          >
            {loading ? 'Creating Magic...' : '🎂 Generate Birthday Link'}
          </button>
        </div>

        {/* Link output */}
        {link && (
          <div
            ref={linkBoxRef}
            style={{
              marginTop: '1.25rem',
              background: 'rgba(240,192,64,0.06)',
              border: '1px solid rgba(240,192,64,0.2)',
              borderRadius: '16px',
              padding: '1.25rem',
            }}
          >
            <p style={{ fontSize: '0.72rem', color: 'rgba(240,192,64,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              ✓ Your wish is ready — share this link
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <code style={{
                flex: 1,
                fontSize: '0.82rem',
                color: '#f0c040',
                wordBreak: 'break-all',
                background: 'rgba(0,0,0,0.2)',
                padding: '0.6rem 0.9rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
              }}>
                {link}
              </code>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={copy}
                  style={{
                    background: copied ? 'rgba(143,188,106,0.15)' : 'rgba(240,192,64,0.1)',
                    border: `1px solid ${copied ? 'rgba(143,188,106,0.4)' : 'rgba(240,192,64,0.3)'}`,
                    borderRadius: '8px',
                    padding: '0.5rem 0.9rem',
                    color: copied ? '#8fbc6a' : '#f0c040',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(232,84,122,0.1)',
                    border: '1px solid rgba(232,84,122,0.3)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.9rem',
                    color: '#e8547a',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Preview →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.7rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
        marginBottom: '0.6rem',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
