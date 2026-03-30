export type WishTemplate = 'starfall' | 'retro' | 'nature' | 'minimal' | 'art'
export type MusicTrack = 'lofi' | 'jazz' | 'orchestral' | 'acoustic' | 'custom' | 'none'
export type TextEffect = 'reveal' | 'typewriter' | 'float'

export const MUSIC_LABELS: Record<MusicTrack, string> = {
  lofi: 'Lo-Fi',
  jazz: 'Jazz',
  orchestral: 'Orchestral',
  acoustic: 'Acoustic',
  custom: 'Custom Upload',
  none: 'No Music',
}

export const TEXT_EFFECT_LABELS: Record<TextEffect, string> = {
  reveal: 'Fade Reveal',
  typewriter: 'Typewriter',
  float: 'Float Up',
}

export interface Wish {
  id: string
  recipientName: string
  message: string
  senderName: string
  template: WishTemplate
  musicTrack: MusicTrack
  textEffect: TextEffect
  createdAt: number
  // New fields
  images?: string[]          // base64 encoded images (max 3)
  customMusicData?: string   // base64 encoded mp3 (max ~3MB for 30sec)
  customMusicName?: string   // original filename
}
