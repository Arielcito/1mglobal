import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

interface VimeoPlayerProps {
  videoId: string
  className?: string
}

// Declare Vimeo types
declare global {
  interface Window {
    Vimeo: {
      Player: new (element: HTMLIFrameElement, options: {
        id: string
        width?: string
        height?: string
        autoplay?: boolean
        autopause?: boolean
        badge?: number
        player_id?: number
        app_id?: number
      }) => {
        on: (event: 'ready' | 'error' | 'loaded', callback: (error?: Error) => void) => void
        destroy: () => void
      }
    }
  }
}

const VimeoPlayer = ({ videoId, className = '' }: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    if (!iframeRef.current || !isScriptLoaded) return

    console.log('Initializing Vimeo player with videoId:', videoId)

    try {
      const player = new window.Vimeo.Player(iframeRef.current, {
        id: videoId,
        width: '100%',
        height: '100%',
        autoplay: false,
        autopause: false,
        badge: 0,
        player_id: 0,
        app_id: 58479,
      })

      player.on('ready', () => {
        console.log('Vimeo player is ready')
      })

      player.on('error', (error?: Error) => {
        console.error('Vimeo player error:', error)
      })

      player.on('loaded', () => {
        console.log('Vimeo video loaded')
      })

      return () => {
        player.destroy()
      }
    } catch (error) {
      console.error('Error initializing Vimeo player:', error)
    }
  }, [videoId, isScriptLoaded])

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${videoId}?h=ae9a9bcee0&badge=0&autopause=0&player_id=0&app_id=58479`}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo video player"
      />
      <Script
        src="https://player.vimeo.com/api/player.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Vimeo API script loaded')
          setIsScriptLoaded(true)
        }}
        onError={(e) => console.error('Error loading Vimeo API:', e)}
        crossOrigin="anonymous"
      />
    </div>
  )
}

export default VimeoPlayer 