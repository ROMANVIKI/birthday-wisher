import { NextRequest, NextResponse } from 'next/server'
import { getWish } from '@/lib/upstash'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const wish = await getWish(id)

  if (!wish) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(wish)
}
