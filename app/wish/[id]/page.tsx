import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getWish } from '@/lib/upstash'
import { MusicPlayer } from '@/components/MusicPlayer'
import {
  StarfallTemplate,
  RetroTemplate,
  NatureTemplate,
  MinimalTemplate,
} from '@/components/templates'
import type { WishTemplate, Wish } from '@/types'

const TEMPLATES: Record<WishTemplate, React.ComponentType<{ wish: Wish }>> = {
  starfall: StarfallTemplate,
  retro: RetroTemplate,
  nature: NatureTemplate,
  minimal: MinimalTemplate,
}

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wish = await getWish(params.id)
  if (!wish) return { title: 'Birthday Wish' }
  return {
    title: `Happy Birthday, ${wish.recipientName}! 🎂`,
    description: `${wish.senderName} has a birthday surprise for you!`,
  }
}

export default async function WishPage({ params }: Props) {
  const wish = await getWish(params.id)
  if (!wish) notFound()

  const Template = TEMPLATES[wish.template] ?? StarfallTemplate

  return (
    <MusicPlayer track={wish.musicTrack} template={wish.template}>
      <Template wish={wish} />
    </MusicPlayer>
  )
}
