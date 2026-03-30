// components/AnimatedText.tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { SplitText } from 'gsap/SplitText' // requires GSAP Club or use a free alternative

gsap.registerPlugin(TextPlugin)

export function AnimatedText({ text, className }: { text: string, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Split into characters manually (free alternative to SplitText)
    el.innerHTML = text.split('').map(char =>
      `<span class="char" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('')

    gsap.from(el.querySelectorAll('.char'), {
      opacity: 0,
      y: 60,
      rotateX: -90,
      stagger: 0.04,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.5
    })
  }, [text])

  return <div ref={ref} className={className} />
}
