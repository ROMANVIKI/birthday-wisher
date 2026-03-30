// app/api/wishes/[id]/route.ts
import { NextResponse } from 'next/server'
import { getWish } from '@/lib/upstash'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const wish = await getWish(params.id)
  if (!wish) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(wish)
}
