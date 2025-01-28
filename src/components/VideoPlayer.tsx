'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export const VideoPlayer = ({ url, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let hls: Hls | null = null;

    const initPlayer = () => {
      if (!videoRef.current) return;

      // Inicializar Plyr
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'fullscreen'
        ],
        settings: ['quality', 'speed'],
        quality: {
          default: 720,
          options: [360, 480, 720]
        },
        speed: {
          selected: 1,
          options: [0.5, 0.75, 1, 1.25, 1.5, 2]
        }
      });
    };

    // Función para cargar video HLS
    const loadHLSVideo = () => {
      hls = new Hls({
        maxBufferSize: 30 * 1000 * 1000, // 30MB max buffer size
        maxBufferLength: 60, // 60 seconds max buffer
        enableWorker: true, // Enable web workers
        lowLatencyMode: true,
        backBufferLength: 90
      });

      if (videoRef.current) {
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              console.log('Reproducción automática bloqueada');
            });
          }
        });

        // Manejo de errores y recuperación
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Error de red, intentando recuperar...');
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Error de medio, intentando recuperar...');
                hls?.recoverMediaError();
                break;
              default:
                console.log('Error fatal, no se puede recuperar');
                hls?.destroy();
                break;
            }
          }
        });
      }
    };

    // Determinar el tipo de video y cargarlo apropiadamente
    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        loadHLSVideo();
      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback para Safari
        videoRef.current.src = url;
      }
    } else {
      // Video normal (MP4, etc.)
      if (videoRef.current) {
        videoRef.current.src = url;
      }
    }

    initPlayer();

    // Cleanup
    return () => {
      if (hls) {
        hls.destroy();
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [url]);

  return (
    <div className="relative w-full aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        playsInline
        preload="metadata"
      />
    </div>
  );
}; 