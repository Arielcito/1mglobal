"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  AudioTrack,
  StartAudio,
  VideoTrack,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useTracks,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { 
  ConnectionState, 
  Track,
  RoomEvent,
  ConnectionQuality,
} from 'livekit-client';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from "sonner";

interface VideoComponentProps {
  isHost?: boolean;
}

interface ParticipantState {
  connectionQuality: ConnectionQuality;
}

export default function VideoComponent({ isHost = false }: VideoComponentProps) {
  const { state: roomState } = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [participantStates, setParticipantStates] = useState<Map<string, ParticipantState>>(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Suscripción simplificada a los tracks
  const videoTracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false }
  ], { onlySubscribed: true });

  const audioTracks = useTracks([
    { source: Track.Source.Microphone, withPlaceholder: false },
    { source: Track.Source.ScreenShareAudio, withPlaceholder: false }
  ], { onlySubscribed: true });

  // Log de tracks
  useEffect(() => {
    console.log('🎥 Video Tracks:', videoTracks.map(track => ({
      trackId: track.publication?.trackSid,
      participantId: track.participant.identity,
      source: track.source,
      isSubscribed: track.publication?.isSubscribed,
      isMuted: track.publication?.isMuted,
      isEnabled: track.publication?.isEnabled,
    })));

    console.log('🔊 Audio Tracks:', audioTracks.map(track => ({
      trackId: track.publication?.trackSid,
      participantId: track.participant.identity,
      source: track.source,
      isSubscribed: track.publication?.isSubscribed,
      isMuted: track.publication?.isMuted,
      isEnabled: track.publication?.isEnabled,
    })));
  }, [videoTracks, audioTracks]);

  // Log de participantes
  useEffect(() => {
    console.log('👥 Participantes:', participants.map(p => ({
      identity: p.identity,
      metadata: p.metadata ? JSON.parse(p.metadata) : null,
      isSpeaking: p.isSpeaking,
      connectionQuality: p.connectionQuality,
      videoTracks: [...p.videoTrackPublications.values()].map(pub => ({
        trackId: pub.trackSid,
        source: pub.source,
        isSubscribed: pub.isSubscribed,
        isMuted: pub.isMuted,
      })),
      audioTracks: [...p.audioTrackPublications.values()].map(pub => ({
        trackId: pub.trackSid,
        source: pub.source,
        isSubscribed: pub.isSubscribed,
        isMuted: pub.isMuted,
      })),
    })));
  }, [participants]);

  // Inicializar AudioContext después de una interacción del usuario
  const handleEnableAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current.resume().then(() => {
          setIsAudioEnabled(true);
        });
      } catch (error) {
        console.error('Error al inicializar AudioContext:', error);
      }
    }
  }, []);

  // Limpiar AudioContext al desmontar
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Encontrar el host entre los participantes
  const hostParticipant = participants.find(p => {
    if (!p.metadata) {
      console.log('🔍 Participante sin metadata:', {
        identity: p.identity,
        isLocalParticipant: p.identity === localParticipant.identity,
        isHost
      });
      return isHost && p.identity === localParticipant.identity;
    }
    try {
      const metadata = JSON.parse(p.metadata);
      console.log('🔍 Metadata del participante:', {
        identity: p.identity,
        metadata,
        isLocalParticipant: p.identity === localParticipant.identity,
        isHost
      });
      return metadata.isHost === true || (isHost && p.identity === localParticipant.identity);
    } catch (error) {
      console.log('❌ Error al parsear metadata:', {
        identity: p.identity,
        metadata: p.metadata,
        error
      });
      return false;
    }
  });

  // Filtrar tracks del host
  const hostVideoTrack = videoTracks.find(track => 
    track.participant.identity === hostParticipant?.identity
  );

  console.log('🎥 Host Video Track:', {
    hostParticipantId: hostParticipant?.identity,
    availableTracks: videoTracks.map(t => ({
      participantId: t.participant.identity,
      source: t.source,
      isSubscribed: t.publication?.isSubscribed
    })),
    selectedTrack: hostVideoTrack ? {
      participantId: hostVideoTrack.participant.identity,
      source: hostVideoTrack.source,
      isSubscribed: hostVideoTrack.publication?.isSubscribed
    } : null
  });

  // Si no hay host pero hay tracks disponibles, mostrar el primer track
  const fallbackVideoTrack = !hostVideoTrack && videoTracks.length > 0 ? videoTracks[0] : null;

  const hostAudioTrack = audioTracks.find(track => 
    track.participant.identity === hostParticipant?.identity
  );

  useEffect(() => {
    const updateParticipantState = () => {
      const newStates = new Map<string, ParticipantState>();
      for (const participant of participants) {
        newStates.set(participant.identity, {
          connectionQuality: participant.connectionQuality,
        });
      }
      setParticipantStates(newStates);
    };

    updateParticipantState();

    const handleEvent = () => updateParticipantState();
    for (const participant of participants) {
      participant.on('connectionQualityChanged', handleEvent);
    }

    return () => {
      for (const participant of participants) {
        participant.off('connectionQualityChanged', handleEvent);
      }
    };
  }, [participants]);

  const getConnectionQualityIcon = useCallback((quality: ConnectionQuality) => {
    switch (quality) {
      case ConnectionQuality.Excellent:
        return <Wifi className="h-4 w-4 text-green-500" />;
      case ConnectionQuality.Good:
        return <Wifi className="h-4 w-4 text-yellow-500" />;
      case ConnectionQuality.Poor:
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  }, []);

  if (!hostParticipant && !fallbackVideoTrack) {
    return (
      <div className="relative h-full w-full bg-black flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-white mb-4">Esperando al streamer...</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white">{participants.length} espectadores</span>
          </div>
        </div>
      </div>
    );
  }

  const hostState = hostParticipant ? participantStates.get(hostParticipant.identity) : null;

  return (
    <div className="relative h-full w-full bg-black">
      {roomState !== ConnectionState.Connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center p-4">
            <p className="text-white mb-4">Conectando al servidor de streaming...</p>
          </div>
        </div>
      )}

      <div className="relative w-full h-full">
        {((hostVideoTrack?.publication && 'trackSid' in hostVideoTrack) || (fallbackVideoTrack?.publication && 'trackSid' in fallbackVideoTrack)) && (
          <VideoTrack
            trackRef={hostVideoTrack?.publication && 'trackSid' in hostVideoTrack ? hostVideoTrack : undefined}
            className="h-full w-full object-cover"
          />
        )}
        {!hostVideoTrack?.publication && !fallbackVideoTrack?.publication && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <p className="text-white">No hay video disponible</p>
          </div>
        )}

        {/* Estado de conexión */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 p-2 rounded-lg">
          {hostState && getConnectionQualityIcon(hostState.connectionQuality)}
          <span className="text-white text-sm">
            {participants.length} espectadores
          </span>
        </div>
      </div>

    </div>
  );
}
