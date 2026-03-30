export type WishTemplate = 'starfall' | 'retro' | 'nature' | 'minimal'
export type MusicTrack = 'lofi' | 'jazz' | 'orchestral' | 'acoustic' | 'none'
export type TextEffect = 'typewriter' | 'reveal' | 'float'

export interface Wish {
  id: string
  recipientName: string
  message: string
  senderName: string
  template: WishTemplate
  musicTrack: MusicTrack
  textEffect: TextEffect
  createdAt: number
}

export const MUSIC_LABELS: Record<MusicTrack, string> = {
  lofi: 'Lo-fi Chill',
  jazz: 'Upbeat Jazz',
  orchestral: 'Orchestral',
  acoustic: 'Acoustic Guitar',
  none: 'No Music',
}

export const TEMPLATE_LABELS: Record<WishTemplate, string> = {
  starfall: 'Starfall',
  retro: 'Retro',
  nature: 'Nature',
  minimal: 'Minimal',
}

export const TEXT_EFFECT_LABELS: Record<TextEffect, string> = {
  typewriter: 'Typewriter',
  reveal: 'Reveal',
  float: 'Float In',
}
