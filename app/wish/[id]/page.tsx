import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getWish } from '@/lib/upstash'
import { MusicPlayer } from '@/components/MusicPlayer'
import {
  StarfallTemplate,
  RetroTemplate,
  NatureTemplate,
  MinimalTemplate,
  ArtTemplate,
} from '@/components/templates'
import type { WishTemplate, Wish } from '@/types'

const TEMPLATES: Record<WishTemplate, React.ComponentType<{ wish: Wish }>> = {
  starfall: StarfallTemplate,
  retro: RetroTemplate,
  nature: NatureTemplate,
  minimal: MinimalTemplate,
  art: ArtTemplate,
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const wish = await getWish(id)
  if (!wish) return { title: 'Birthday Wish' }
  return {
    title: `Happy Birthday, ${wish.recipientName}!`,
    description: `${wish.senderName} has a birthday surprise for you!`,
  }
}

export default async function WishPage({ params }: Props) {
  const { id } = await params
  const wish = await getWish(id)
  if (!wish) notFound()

  const Template = TEMPLATES[wish.template] ?? StarfallTemplate

  return (
    <MusicPlayer
      track={wish.musicTrack}
      template={wish.template}
      images={wish.images ?? []}
      customMusicData={wish.customMusicData}
    >
      <Template wish={wish} />
    </MusicPlayer>
  )
}
