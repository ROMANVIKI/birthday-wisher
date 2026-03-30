import { Redis } from '@upstash/redis'
import type { Wish } from '@/types'


const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const TTL = 60 * 60 * 24 * 30 // 30 days

// export async function saveWish(wish: Wish): Promise<void> {
//   await redis.set(`wish:${wish.id}`, wish, { ex: TTL })
// }


export async function saveWish(wish: Wish): Promise<void> {
  await redis.set(`wish:${wish.id}`, wish, { ex: TTL })
}

export async function getWish(id: string): Promise<Wish | null> {
  return redis.get<Wish>(`wish:${id}`)
}
