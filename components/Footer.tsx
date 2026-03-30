import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-6 flex items-center justify-center">
      <p className="text-sm text-white/60 flex items-center gap-2 font-light tracking-wide hover:text-white/80 transition duration-300">

        <span>Made with</span>

        {/* 💖 Heart with glow + ping */}
        <span className="relative flex items-center justify-center">

          {/* Ping effect */}
          <span className="absolute inline-flex h-5 w-5 rounded-full bg-pink-500 opacity-75 animate-ping [animation-duration:1.5s]" />

          {/* Lucide Heart */}
          <Heart
            className="h-5 w-5 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.9)]"
            fill="currentColor"
          />
        </span>

        <span>by</span>

        <span className="text-pink-400 font-medium tracking-wider">
          romanviki
        </span>

      </p>
    </footer>
  )
}
