"use client";

import { useEffect, useState } from "react";
import type { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  AudioTrack,
  StartAudio,
  VideoTrack,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useTracks,
} from '@livekit/components-react';
import { 
  ConnectionState, 
  Track,
  type Participant,
  RoomEvent,
  ConnectionQuality,
} from 'livekit-client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Mic, MicOff, Video, VideoOff, Users } from 'lucide-react';

interface VideoComponentProps {
  isHost?: boolean;
}

export default function VideoComponent({ isHost = false }: VideoComponentProps) {
  const { metadata, state: roomState } = useRoomContext();
  const roomMetadata = metadata ? JSON.parse(metadata) as RoomMetadata : null;
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [participantStates, setParticipantStates] = useState<Map<string, {
    isSpeaking: boolean;
    connectionQuality: ConnectionQuality;
    audioLevel: number;
    hasAudioTrack: boolean;
    hasVideoTrack: boolean;
  }>>(new Map());

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Microphone, withPlaceholder: false },
      { source: Track.Source.ScreenShareAudio, withPlaceholder: false },
    ],
    { 
      updateOnlyOn: [RoomEvent.TrackSubscribed, RoomEvent.TrackUnsubscribed],
    }
  );

  // Encontrar el streamer (host)
  const hostParticipant = participants.find(p => {
    try {
      const metadata = p.metadata ? JSON.parse(p.metadata) : null;
      return metadata?.isHost;
    } catch {
      return false;
    }
  });

  // Obtener los tracks del host
  const hostVideoTrack = tracks.find(
    track => 
      track.participant.identity === hostParticipant?.identity && 
      (track.source === Track.Source.Camera || track.source === Track.Source.ScreenShare)
  );

  const hostAudioTrack = tracks.find(
    track => 
      track.participant.identity === hostParticipant?.identity && 
      (track.source === Track.Source.Microphone || track.source === Track.Source.ScreenShareAudio)
  );

  const getParticipantMetadata = (participant: Participant) => {
    try {
      return participant.metadata ? JSON.parse(participant.metadata) as ParticipantMetadata : null;
    } catch (error) {
      console.error('Error al parsear metadata del participante:', error);
      return null;
    }
  };

  useEffect(() => {
    const updateParticipantState = () => {
      const newStates = new Map();
      for (const participant of participants) {
        const hasAudioTrack = Object.values(participant.audioTrackPublications).length > 0;
        const hasVideoTrack = Object.values(participant.videoTrackPublications).length > 0;
        
        newStates.set(participant.identity, {
          isSpeaking: participant.isSpeaking,
          connectionQuality: participant.connectionQuality,
          audioLevel: participant.audioLevel,
          hasAudioTrack,
          hasVideoTrack,
        });
      }
      setParticipantStates(newStates);
    };

    updateParticipantState();

    for (const participant of participants) {
      participant.on('isSpeakingChanged', updateParticipantState);
      participant.on('connectionQualityChanged', updateParticipantState);
      participant.on('trackMuted', updateParticipantState);
      participant.on('trackUnmuted', updateParticipantState);
    }

    return () => {
      for (const participant of participants) {
        participant.off('isSpeakingChanged', updateParticipantState);
        participant.off('connectionQualityChanged', updateParticipantState);
        participant.off('trackMuted', updateParticipantState);
        participant.off('trackUnmuted', updateParticipantState);
      }
    };
  }, [participants]);

  const getConnectionQualityIcon = (quality: ConnectionQuality) => {
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
  };

  if (!hostParticipant || !hostVideoTrack) {
    return (
      <div className="relative h-full w-full bg-black flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-white mb-4">Esperando al streamer...</p>
        </div>
      </div>
    );
  }

  const hostState = participantStates.get(hostParticipant.identity);
  const hostMetadata = getParticipantMetadata(hostParticipant);

  return (
    <div className="relative h-full w-full bg-black">
      {roomState !== ConnectionState.Connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center p-4">
            <p className="text-white mb-4">Conectando al servidor de streaming...</p>
          </div>
        </div>
      )}

      {/* Vista principal del streamer */}
      <div className="relative w-full h-full">
        {hostVideoTrack.publication && (
          <VideoTrack
            trackRef={hostVideoTrack}
            className={cn(
              "h-full w-full",
              hostVideoTrack.source === Track.Source.ScreenShare ? "object-contain" : "object-cover"
            )}
          />
        )}

        {/* Información del streamer */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={hostMetadata?.avatarUrl} />
            <AvatarFallback>{hostParticipant.identity[0] ?? "?"}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <span className="text-white font-semibold">
              {hostMetadata?.name || hostParticipant.identity}
            </span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-white" />
              <span className="text-white text-sm">
                {participants.length} espectadores
              </span>
            </div>
          </div>

          {hostState && (
            <div className="flex items-center gap-2 bg-black/60 p-2 rounded-lg">
              {getConnectionQualityIcon(hostState.connectionQuality)}
              {hostState.hasAudioTrack ? 
                <Mic className="h-4 w-4 text-green-500" /> : 
                <MicOff className="h-4 w-4 text-red-500" />
              }
              {hostState.hasVideoTrack ? 
                <Video className="h-4 w-4 text-green-500" /> : 
                <VideoOff className="h-4 w-4 text-red-500" />
              }
            </div>
          )}
        </div>
      </div>

      {hostAudioTrack?.publication && (
        <AudioTrack 
          key={`${hostParticipant.identity}-${hostAudioTrack.source}`} 
          trackRef={hostAudioTrack} 
        />
      )}

      <StartAudio label="Haz clic para activar el audio" />
    </div>
  );
}
