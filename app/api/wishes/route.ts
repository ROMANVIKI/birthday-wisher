import { NextResponse } from 'next/server'
import { saveWish } from '@/lib/upstash'
import type { Wish } from '@/types'

// Limits
const MAX_IMAGES = 3
const MAX_IMAGE_B64_SIZE = 2.5 * 1024 * 1024   // ~2.5MB base64 per image
const MAX_MUSIC_B64_SIZE = 4.5 * 1024 * 1024   // ~4.5MB base64 for 30s mp3

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ── Validate images ─────────────────────────────────────────────
    const images: string[] = []
    if (Array.isArray(body.images)) {
      if (body.images.length > MAX_IMAGES) {
        return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed` }, { status: 400 })
      }
      for (const img of body.images) {
        if (typeof img !== 'string' || !img.startsWith('data:image/')) {
          return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
        }
        if (img.length > MAX_IMAGE_B64_SIZE) {
          return NextResponse.json({ error: 'Image too large (max 2MB each)' }, { status: 400 })
        }
        images.push(img)
      }
    }

    // ── Validate custom music ───────────────────────────────────────
    let customMusicData: string | undefined
    let customMusicName: string | undefined

    if (body.customMusicData) {
      if (typeof body.customMusicData !== 'string' || !body.customMusicData.startsWith('data:audio/')) {
        return NextResponse.json({ error: 'Invalid music format — MP3 only' }, { status: 400 })
      }
      if (body.customMusicData.length > MAX_MUSIC_B64_SIZE) {
        return NextResponse.json({ error: 'Music file too large (max 30s / ~4MB)' }, { status: 400 })
      }
      customMusicData = body.customMusicData
      customMusicName = typeof body.customMusicName === 'string'
        ? body.customMusicName.slice(0, 120)
        : 'custom.mp3'
    }

    // ── Build wish ──────────────────────────────────────────────────
    const wish: Wish = {
      id: body.id,
      recipientName: body.recipientName?.trim() || 'Friend',
      message: body.message?.trim() || 'Wishing you the happiest of birthdays!',
      senderName: body.senderName?.trim() || 'Someone special',
      template: body.template || 'starfall',
      musicTrack: body.musicTrack || 'lofi',
      textEffect: body.textEffect || 'reveal',
      createdAt: Date.now(),
      images: images.length > 0 ? images : undefined,
      customMusicData,
      customMusicName,
    }

    await saveWish(wish)
    return NextResponse.json({ id: wish.id }, { status: 201 })

  } catch (err) {
    console.error('[POST /api/wishes]', err)
    return NextResponse.json({ error: 'Failed to create wish' }, { status: 500 })
  }
}
