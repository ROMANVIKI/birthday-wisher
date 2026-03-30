import type { Metadata } from 'next'
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: 'Birthday Wisher — Create Magical Birthday Surprises',
  description: 'Create beautiful animated birthday wishes with music and share them with a link.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
