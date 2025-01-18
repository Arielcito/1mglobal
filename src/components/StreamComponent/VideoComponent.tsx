"use client";

import { useEffect, useState, useCallback } from "react";
import type { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  AudioTrack,
  StartAudio,
  VideoTrack,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useTracks,
  TrackReference,
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { 
  ConnectionState, 
  Track,
  type Participant,
  RoomEvent,
  ConnectionQuality,
  VideoPresets,
  Room,
  RoomOptions,
  RoomConnectOptions
} from 'livekit-client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Wifi, 
  WifiOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Users,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Rows
} from 'lucide-react';
import { toast } from "sonner";

interface VideoComponentProps {
  isHost?: boolean;
}

interface ParticipantState {
  isSpeaking: boolean;
  connectionQuality: ConnectionQuality;
  audioLevel: number;
  hasAudioTrack: boolean;
  hasVideoTrack: boolean;
  isScreenSharing: boolean;
}

type ParticipantEvent = 
  | 'isSpeakingChanged'
  | 'connectionQualityChanged'
  | 'trackMuted'
  | 'trackUnmuted'
  | 'trackPublished'
  | 'trackUnpublished';

export default function VideoComponent({ isHost = false }: VideoComponentProps) {
  const { metadata, state: roomState } = useRoomContext();
  const roomMetadata = metadata ? JSON.parse(metadata) as RoomMetadata : null;
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [participantStates, setParticipantStates] = useState<Map<string, ParticipantState>>(new Map());

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
      { source: Track.Source.ScreenShareAudio, withPlaceholder: false },
    ],
    { 
      updateOnlyOn: [
        RoomEvent.TrackSubscribed, 
        RoomEvent.TrackUnsubscribed,
        RoomEvent.TrackPublished,
        RoomEvent.TrackUnpublished,
      ],
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

  const getParticipantMetadata = useCallback((participant: Participant) => {
    try {
      return participant.metadata ? JSON.parse(participant.metadata) as ParticipantMetadata : null;
    } catch (error) {
      console.error('Error al parsear metadata del participante:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const updateParticipantState = () => {
      const newStates = new Map();
      for (const participant of participants) {
        const hasAudioTrack = Object.values(participant.audioTrackPublications).length > 0;
        const hasVideoTrack = Object.values(participant.videoTrackPublications).length > 0;
        const isScreenSharing = Object.values(participant.videoTrackPublications).some(
          pub => pub.source === Track.Source.ScreenShare
        );
        
        newStates.set(participant.identity, {
          isSpeaking: participant.isSpeaking,
          connectionQuality: participant.connectionQuality,
          audioLevel: participant.audioLevel,
          hasAudioTrack,
          hasVideoTrack,
          isScreenSharing,
        });
      }
      setParticipantStates(newStates);
    };

    updateParticipantState();

    const events: ParticipantEvent[] = [
      'isSpeakingChanged',
      'connectionQualityChanged',
      'trackMuted',
      'trackUnmuted',
      'trackPublished',
      'trackUnpublished',
    ];

    const handleEvent = () => updateParticipantState();

    for (const participant of participants) {
      for (const event of events) {
        participant.on(event, handleEvent);
      }
    }

    return () => {
      for (const participant of participants) {
        for (const event of events) {
          participant.off(event, handleEvent);
        }
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

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error al cambiar el modo pantalla completa:', error);
      toast.error('No se pudo cambiar el modo pantalla completa');
    }
  }, []);

  const toggleLayout = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  if (!hostParticipant || !hostVideoTrack) {
    return (
      <div className="relative h-full w-full bg-black flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-white mb-4">Esperando al streamer...</p>
          <div className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5 text-white" />
            <span className="text-white">{participants.length} espectadores</span>
          </div>
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

      {/* Controles de vista */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/60 hover:bg-black/80 text-white"
          onClick={toggleLayout}
        >
          {showGrid ? <Rows className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/60 hover:bg-black/80 text-white"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      {showGrid ? (
        <GridLayout
          tracks={tracks}
          className="h-full w-full"
        >
          <ParticipantTile />
        </GridLayout>
      ) : (
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
                {hostState.isScreenSharing && (
                  <Badge variant="secondary" className="text-xs">
                    Compartiendo pantalla
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {hostAudioTrack?.publication && (
        <AudioTrack 
          key={`${hostParticipant.identity}-${hostAudioTrack.source}`} 
          trackRef={hostAudioTrack} 
        />
      )}

      <RoomAudioRenderer />
      <StartAudio label="Haz clic para activar el audio" />

      {isHost && (
        <div className="absolute bottom-4 right-4 z-50">
          <ControlBar 
            controls={{ 
              microphone: true, 
              camera: true, 
              screenShare: true,
              leave: true 
            }}
          />
        </div>
      )}
    </div>
  );
}
