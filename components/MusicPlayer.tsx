'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import type { MusicTrack } from '@/types'

const TRACKS: Record<string, string> = {
  lofi: '/music/lofi-birthday-music1.mp3',
  jazz: '/music/ The_Birthday_Massacre.mp3',
  orchestral: '/music/jaanu_bgm_music.mp3',
  acoustic: '/music/3_movie_flure.mp3',
}

interface MusicPlayerProps {
  track: MusicTrack
  template: string
  children: React.ReactNode
  onEnter?: () => void
}

const SPLASH_THEMES: Record<string, { bg: string; text: string; sub: string; emoji: string }> = {
  starfall: { bg: 'linear-gradient(160deg,#060918,#12093a)', text: '#f0c040', sub: 'rgba(255,255,255,0.35)', emoji: '✨' },
  retro: { bg: 'linear-gradient(160deg,#07000f,#1a0030)', text: '#ff2d78', sub: 'rgba(0,245,255,0.4)', emoji: '⚡' },
  nature: { bg: 'linear-gradient(160deg,#071409,#0f2a10)', text: '#8fbc6a', sub: 'rgba(200,230,160,0.4)', emoji: '🌿' },
  minimal: { bg: 'linear-gradient(160deg,#f7f4ed,#ede8dc)', text: '#2d2820', sub: 'rgba(45,40,32,0.35)', emoji: '◇' },
}

export function MusicPlayer({ track, template, children, onEnter }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [entered, setEntered] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [volume, setVolume] = useState(0.6)
  const theme = SPLASH_THEMES[template] ?? SPLASH_THEMES.starfall

  const handleEnter = useCallback(() => {
    setEntered(true)
    onEnter?.()
    if (track !== 'none' && audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.play().catch(() => { })
    }
  }, [track, volume, onEnter])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => { })
    }
    setPlaying(p => !p)
  }, [playing])

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  useEffect(() => {
    return () => { audioRef.current?.pause() }
  }, [])

  return (
    <>
      {track !== 'none' && (
        <audio ref={audioRef} src={TRACKS[track]} loop preload="auto" />
      )}

      {!entered ? (
        <div
          onClick={handleEnter}
          style={{
            minHeight: '100vh',
            background: theme.bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            gap: '1.5rem',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400&display=swap');
            @keyframes floatEmoji { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
            @keyframes tapPulse { 0%,100%{opacity:0.35} 50%{opacity:0.8} }
          `}</style>
          <span style={{ fontSize: '4.5rem', animation: 'floatEmoji 3s ease-in-out infinite', display: 'block' }}>
            {theme.emoji}
          </span>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: theme.text, letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 300 }}>
              {track !== 'none' ? '🎵 A birthday surprise with music awaits' : 'A birthday surprise awaits'}
            </p>
            <p style={{ fontSize: '0.75rem', color: theme.sub, letterSpacing: '0.2em', textTransform: 'uppercase', animation: 'tapPulse 2s ease-in-out infinite' }}>
              Tap anywhere to open
            </p>
          </div>
        </div>
      ) : (
        <>
          {children}
          {track !== 'none' && (
            <MusicControls playing={playing} volume={volume} onToggle={togglePlay} onVolume={handleVolume} template={template} />
          )}
        </>
      )}
    </>
  )
}

interface MusicControlsProps {
  playing: boolean
  volume: number
  onToggle: () => void
  onVolume: (e: React.ChangeEvent<HTMLInputElement>) => void
  template: string
}

function MusicControls({ playing, volume, onToggle, onVolume, template }: MusicControlsProps) {
  const [expanded, setExpanded] = useState(false)
  const isDark = template !== 'minimal'

  const bg = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.75)'
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(45,40,32,0.12)'
  const color = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(45,40,32,0.8)'
  const accent = template === 'retro' ? '#ff2d78' : template === 'nature' ? '#8fbc6a' : template === 'minimal' ? '#2d2820' : '#f0c040'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {expanded && (
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '14px',
          padding: '0.75rem 1rem',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: '160px',
        }}>
          <span style={{ fontSize: '0.75rem', color }}>🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={onVolume}
            style={{ flex: 1, accentColor: accent, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.75rem', color }}>{Math.round(volume * 100)}%</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            cursor: 'pointer',
            color,
            fontSize: '1rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          title="Volume"
        >
          🎚️
        </button>
        <button
          onClick={onToggle}
          style={{
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            cursor: 'pointer',
            color,
            fontSize: '1rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          title={playing ? 'Pause music' : 'Play music'}
        >
          {playing ? '⏸' : '▶️'}
        </button>
      </div>
    </div>
  )
}

