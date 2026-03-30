import { NextResponse } from 'next/server'
import { saveWish } from '@/lib/upstash'
import type { Wish } from '@/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const wish: Wish = {
      id: body.id,
      recipientName: body.recipientName?.trim() || 'Friend',
      message: body.message?.trim() || 'Wishing you the happiest of birthdays!',
      senderName: body.senderName?.trim() || 'Someone special',
      template: body.template || 'starfall',
      musicTrack: body.musicTrack || 'lofi',
      textEffect: body.textEffect || 'reveal',
      createdAt: Date.now(),
    }

    await saveWish(wish)

    return NextResponse.json({ id: wish.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/wishes]', err)
    return NextResponse.json({ error: 'Failed to create wish' }, { status: 500 })
  }
}
