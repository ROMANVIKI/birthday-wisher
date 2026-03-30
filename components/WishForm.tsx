'use client'
import { useState, useRef, useCallback } from 'react'
import { nanoid } from 'nanoid'
import {
  Upload, Music, Image as ImageIcon, X, Play, Pause,
  Sparkles, Type, Waves, ChevronRight, Check, Copy,
  ExternalLink, Star, Zap, Leaf, Minus, Palette
} from 'lucide-react'
import type { WishTemplate, MusicTrack, TextEffect } from '@/types'
import { MUSIC_LABELS, TEXT_EFFECT_LABELS } from '@/types'

const TEMPLATES: { id: WishTemplate; label: string; desc: string; accentColor: string; bgColor: string }[] = [
  { id: 'starfall', label: 'Starfall', desc: 'Dark & golden', accentColor: '#f0c040', bgColor: '#090b1a' },
  { id: 'retro', label: 'Retro', desc: 'Neon & grid', accentColor: '#ff2d78', bgColor: '#07000f' },
  { id: 'nature', label: 'Nature', desc: 'Botanical', accentColor: '#8fbc6a', bgColor: '#0d2010' },
  { id: 'minimal', label: 'Minimal', desc: 'Refined', accentColor: '#2d2820', bgColor: '#f7f4ed' },
  { id: 'art', label: 'Art', desc: 'Art Nouveau', accentColor: '#c8964a', bgColor: '#1a1208' },
]

const TEMPLATE_ICONS: Record<WishTemplate, React.ReactNode> = {
  starfall: <Star size={14} />,
  retro: <Zap size={14} />,
  nature: <Leaf size={14} />,
  minimal: <Minus size={14} />,
  art: <Palette size={14} />,
}

const MUSIC_OPTIONS: MusicTrack[] = ['lofi', 'jazz', 'orchestral', 'acoustic', 'custom', 'none']
const MUSIC_ICONS: Record<MusicTrack, React.ReactNode> = {
  lofi: <Music size={14} />,
  jazz: <Music size={14} />,
  orchestral: <Music size={14} />,
  acoustic: <Music size={14} />,
  custom: <Upload size={14} />,
  none: <Minus size={14} />,
}

const TEXT_EFFECTS: TextEffect[] = ['reveal', 'typewriter', 'float']
const TEXT_EFFECT_ICONS: Record<TextEffect, React.ReactNode> = {
  reveal: <Sparkles size={14} />,
  typewriter: <Type size={14} />,
  float: <Waves size={14} />,
}

const MAX_IMAGES = 3
const MAX_IMAGE_SIZE_MB = 2
const MAX_MUSIC_DURATION_SEC = 30
const MAX_MUSIC_SIZE_MB = 4

export default function WishForm() {
  const [form, setForm] = useState({
    recipientName: '',
    message: '',
    senderName: '',
    template: 'starfall' as WishTemplate,
    musicTrack: 'lofi' as MusicTrack,
    textEffect: 'reveal' as TextEffect,
  })

  // Image state
  const [images, setImages] = useState<{ file: File; preview: string; b64: string }[]>([])
  const [imageError, setImageError] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Music state
  const [customMusic, setCustomMusic] = useState<{ file: File; b64: string; duration: number } | null>(null)
  const [musicError, setMusicError] = useState('')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const musicInputRef = useRef<HTMLInputElement>(null)
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null)

  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const linkBoxRef = useRef<HTMLDivElement>(null)

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  // ── Image upload ──────────────────────────────────────────────────
  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files) return
    setImageError('')
    const incoming = Array.from(files)

    if (images.length + incoming.length > MAX_IMAGES) {
      setImageError(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const processed: { file: File; preview: string; b64: string }[] = []

    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed')
        return
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setImageError(`Each image must be under ${MAX_IMAGE_SIZE_MB}MB`)
        return
      }
      const b64 = await fileToBase64(file)
      const preview = URL.createObjectURL(file)
      processed.push({ file, preview, b64 })
    }

    setImages(prev => [...prev, ...processed])
  }, [images])

  const removeImage = (idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  // ── Custom music upload ───────────────────────────────────────────
  const handleMusicUpload = useCallback(async (file: File | null) => {
    if (!file) return
    setMusicError('')

    if (file.type !== 'audio/mpeg' && !file.name.endsWith('.mp3')) {
      setMusicError('Only MP3 files are allowed')
      return
    }
    if (file.size > MAX_MUSIC_SIZE_MB * 1024 * 1024) {
      setMusicError(`Music file must be under ${MAX_MUSIC_SIZE_MB}MB`)
      return
    }

    // Validate duration
    const duration = await getAudioDuration(file)
    if (duration > MAX_MUSIC_DURATION_SEC) {
      setMusicError(`Music must be ${MAX_MUSIC_DURATION_SEC} seconds or less (yours: ${Math.round(duration)}s)`)
      return
    }

    const b64 = await fileToBase64(file)
    setCustomMusic({ file, b64, duration })

    // Set up preview audio
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause()
    }
    const audio = new Audio()
    audio.src = URL.createObjectURL(file)
    audio.loop = true
    audioPreviewRef.current = audio
    setMusicPlaying(false)
  }, [])

  const toggleMusicPreview = () => {
    const audio = audioPreviewRef.current
    if (!audio) return
    if (musicPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => { })
    }
    setMusicPlaying(p => !p)
  }

  // ── Generate ──────────────────────────────────────────────────────
  const generate = async () => {
    if (!form.recipientName.trim()) { alert('Please enter a recipient name'); return }
    if (form.musicTrack === 'custom' && !customMusic) {
      alert('Please upload a custom music file or choose a preset track')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        id: nanoid(10),
        images: images.map(i => i.b64),
        ...(form.musicTrack === 'custom' && customMusic
          ? { customMusicData: customMusic.b64, customMusicName: customMusic.file.name }
          : {}),
      }
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      background: 'radial-gradient(ellipse at 30% 20%, #13102a 0%, #0a0a12 55%, #0a120d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        input[type="text"], textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: rgba(255,255,255,0.9);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        input[type="text"]:focus, textarea:focus {
          border-color: rgba(240,192,64,0.4);
          background: rgba(255,255,255,0.06);
        }
        input[type="text"]::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
        textarea { resize: none; height: 108px; line-height: 1.65; }

        .upload-zone {
          border: 1.5px dashed rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 1.25rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .upload-zone:hover {
          border-color: rgba(240,192,64,0.35);
          background: rgba(240,192,64,0.04);
        }

        .chip-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          cursor: pointer;
          color: rgba(255,255,255,0.45);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: all 0.18s;
        }
        .chip-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
        }
        .chip-btn.active {
          background: rgba(240,192,64,0.09);
          border-color: rgba(240,192,64,0.5);
          color: #f0c040;
        }

        .music-chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
          cursor: pointer;
          color: rgba(255,255,255,0.45);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.18s;
        }
        .music-chip:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
        .music-chip.active { background: rgba(240,192,64,0.09); border-color: rgba(240,192,64,0.5); color: #f0c040; }

        .img-thumb {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 1;
          background: rgba(255,255,255,0.05);
        }
        .img-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .img-thumb .remove-btn {
          position: absolute;
          top: 4px; right: 4px;
          background: rgba(0,0,0,0.65);
          border: none;
          border-radius: 50%;
          width: 22px; height: 22px;
          cursor: pointer;
          color: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .img-thumb:hover .remove-btn { opacity: 1; }

        .error-msg { font-size: 0.72rem; color: #f07060; margin-top: 6px; display: flex; align-items: center; gap: 4px; }

        .template-card {
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 5/4;
          transition: border-color 0.2s, transform 0.15s;
          position: relative;
        }
        .template-card.active { transform: translateY(-2px); }
        .template-card-inner {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 6px;
        }
        .template-label {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          margin-top: 2px;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div style={{ maxWidth: '640px', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 900,
            fontSize: 'clamp(2.2rem, 7vw, 3.4rem)',
            background: 'linear-gradient(135deg, #f0c040 0%, #e8547a 55%, #c040f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Birthday Wisher
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
            Craft a cinematic birthday experience. Share the link.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '2rem',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
        }}>

          {/* Recipient */}
          <Field label="Recipient's Name">
            <input type="text" placeholder="e.g. Priya" maxLength={40}
              value={form.recipientName} onChange={e => set('recipientName', e.target.value)} />
          </Field>

          {/* Message */}
          <Field label="Your Message">
            <textarea placeholder="Write something heartfelt..." maxLength={400}
              value={form.message} onChange={e => set('message', e.target.value)} />
            <div style={{ textAlign: 'right', fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', marginTop: '4px' }}>
              {form.message.length}/400
            </div>
          </Field>

          {/* From */}
          <Field label="From">
            <input type="text" placeholder="Your name" maxLength={40}
              value={form.senderName} onChange={e => set('senderName', e.target.value)} />
          </Field>

          {/* Images */}
          <Field label={`Photo Slideshow (up to ${MAX_IMAGES} images)`}>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => handleImageUpload(e.target.files)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${MAX_IMAGES + 1}, 1fr)`, gap: '8px', alignItems: 'start' }}>
              {images.map((img, i) => (
                <div key={i} className="img-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt={`Upload ${i + 1}`} />
                  <button className="remove-btn" onClick={() => removeImage(i)}>
                    <X size={11} />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <div
                  className="upload-zone"
                  onClick={() => imageInputRef.current?.click()}
                  style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ImageIcon size={18} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>Add photo</span>
                </div>
              )}
            </div>
            {imageError && <p className="error-msg"><X size={11} />{imageError}</p>}
            <p style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.18)', marginTop: '6px' }}>
              Shown as a cinematic slideshow before the message. Max {MAX_IMAGE_SIZE_MB}MB each.
            </p>
          </Field>

          {/* Templates */}
          <Field label="Visual Theme">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {TEMPLATES.map(t => (
                <div
                  key={t.id}
                  className={`template-card ${form.template === t.id ? 'active' : ''}`}
                  style={{ borderColor: form.template === t.id ? t.accentColor : 'rgba(255,255,255,0.07)' }}
                  onClick={() => set('template', t.id)}
                >
                  <div
                    className="template-card-inner"
                    style={{ background: t.id === 'minimal' ? '#f7f4ed' : `linear-gradient(160deg, ${t.bgColor}, ${t.bgColor}dd)` }}
                  >
                    <span style={{ color: t.accentColor }}>{TEMPLATE_ICONS[t.id]}</span>
                    <span
                      className="template-label"
                      style={{ color: form.template === t.id ? t.accentColor : t.id === 'minimal' ? 'rgba(45,40,32,0.5)' : 'rgba(255,255,255,0.4)' }}
                    >
                      {t.label}
                    </span>
                    <span style={{ fontSize: '0.58rem', color: t.id === 'minimal' ? 'rgba(45,40,32,0.3)' : 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans',sans-serif" }}>
                      {t.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Field>

          {/* Text Effect */}
          <Field label="Text Animation">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {TEXT_EFFECTS.map(e => (
                <button
                  key={e}
                  className={`chip-btn ${form.textEffect === e ? 'active' : ''}`}
                  onClick={() => set('textEffect', e)}
                >
                  {TEXT_EFFECT_ICONS[e]}
                  <span>{TEXT_EFFECT_LABELS[e]}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Music */}
          <Field label="Background Music">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {MUSIC_OPTIONS.map(m => (
                <button
                  key={m}
                  className={`music-chip ${form.musicTrack === m ? 'active' : ''}`}
                  onClick={() => { set('musicTrack', m) }}
                >
                  {MUSIC_ICONS[m]}
                  <span>{MUSIC_LABELS[m]}</span>
                </button>
              ))}
            </div>

            {/* Custom music upload */}
            {form.musicTrack === 'custom' && (
              <div style={{ marginTop: '10px' }}>
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/mpeg,.mp3"
                  style={{ display: 'none' }}
                  onChange={e => handleMusicUpload(e.target.files?.[0] ?? null)}
                />
                {!customMusic ? (
                  <div
                    className="upload-zone"
                    onClick={() => musicInputRef.current?.click()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '1.5rem' }}
                  >
                    <Upload size={20} style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <div>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>
                        Upload MP3 (max {MAX_MUSIC_DURATION_SEC}s)
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)' }}>
                        Max {MAX_MUSIC_SIZE_MB}MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(240,192,64,0.06)',
                    border: '1px solid rgba(240,192,64,0.2)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <button
                      onClick={toggleMusicPreview}
                      style={{
                        background: 'rgba(240,192,64,0.15)',
                        border: '1px solid rgba(240,192,64,0.3)',
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        cursor: 'pointer',
                        color: '#f0c040',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {musicPlaying ? <Pause size={13} /> : <Play size={13} />}
                    </button>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(240,192,64,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {customMusic.file.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
                        {Math.round(customMusic.duration)}s
                      </p>
                    </div>
                    <button
                      onClick={() => { setCustomMusic(null); audioPreviewRef.current?.pause(); setMusicPlaying(false) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '2px', display: 'flex' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {musicError && <p className="error-msg"><X size={11} />{musicError}</p>}
              </div>
            )}
          </Field>

          {/* CTA */}
          <button
            onClick={generate}
            disabled={loading}
            style={{
              background: loading ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg, #f0c040 0%, #e8547a 100%)',
              border: loading ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderRadius: '12px',
              padding: '1rem',
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: loading ? 'rgba(255,255,255,0.3)' : '#0d0d14',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'none' }}
          >
            {loading
              ? <>Creating<span style={{ opacity: 0.5 }}>...</span></>
              : <><ChevronRight size={16} /> Generate Birthday Link</>
            }
          </button>
        </div>

        {/* Link output */}
        {link && (
          <div
            ref={linkBoxRef}
            style={{
              marginTop: '1.25rem',
              background: 'rgba(240,192,64,0.05)',
              border: '1px solid rgba(240,192,64,0.18)',
              borderRadius: '16px',
              padding: '1.25rem',
            }}
          >
            <p style={{ fontSize: '0.68rem', color: 'rgba(240,192,64,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Check size={11} /> Your wish is ready — share this link
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <code style={{
                flex: 1,
                fontSize: '0.8rem',
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
                    background: copied ? 'rgba(143,188,106,0.12)' : 'rgba(240,192,64,0.08)',
                    border: `1px solid ${copied ? 'rgba(143,188,106,0.35)' : 'rgba(240,192,64,0.25)'}`,
                    borderRadius: '8px',
                    padding: '0.5rem 0.9rem',
                    color: copied ? '#8fbc6a' : '#f0c040',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(232,84,122,0.08)',
                    border: '1px solid rgba(232,84,122,0.25)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.9rem',
                    color: '#e8547a',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ExternalLink size={12} />
                  Preview
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
        fontSize: '0.65rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.28)',
        textTransform: 'uppercase',
        marginBottom: '0.55rem',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement('audio')
    const url = URL.createObjectURL(file)
    audio.src = url
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url)
      resolve(audio.duration)
    })
    audio.addEventListener('error', () => resolve(Infinity))
  })
}
