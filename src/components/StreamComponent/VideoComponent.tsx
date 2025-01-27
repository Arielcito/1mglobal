"use client";

import { useEffect, useState, useRef } from "react";
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
  TrackPublication,
} from 'livekit-client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Mic, MicOff, Video, VideoOff, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createLocalTracks, LocalVideoTrack } from "livekit-client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MediaDeviceSettings } from "./MediaDeviceSettings";
import api from '@/app/libs/axios';
import { StopStreamResponse } from "@/types/api";

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
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const localVideoEl = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // Agregar logs iniciales
  useEffect(() => {
    console.log('=== ESTADO INICIAL DEL COMPONENTE ===');
    console.log('Room State:', roomState);
    console.log('Room Metadata:', roomMetadata);
    console.log('Local Participant:', {
      identity: localParticipant.identity,
      metadata: localParticipant.metadata,
      publications: [...localParticipant.trackPublications.values()].map(pub => ({
        trackSid: pub.trackSid,
        kind: pub.kind,
        source: pub.source
      }))
    });
    console.log('Todos los participantes:', participants.map(p => ({
      identity: p.identity,
      metadata: p.metadata ? JSON.parse(p.metadata) : null,
      publications: [...p.trackPublications.values()].map(pub => ({
        trackSid: pub.trackSid,
        kind: pub.kind,
        source: pub.source
      }))
    })));
  }, [roomState, roomMetadata, localParticipant, participants]);

  // Logs para tracks
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

  useEffect(() => {
    console.log('=== TRACKS ACTUALIZADOS ===');
    console.log('Tracks disponibles:', tracks.map(track => ({
      trackId: track.publication?.trackSid,
      source: track.source,
      participant: track.participant.identity,
      isSubscribed: track.publication?.isSubscribed,
      isMuted: track.publication?.isMuted
    })));
  }, [tracks]);

  // Encontrar el streamer (host)
  const hostParticipant = participants.find(p => {
    if (!p.metadata || p.metadata === "") {
      // Si el participante es el host local, lo identificamos
      if (isHost && p.identity === localParticipant.identity) {
        console.log('Host identificado como participante local:', p.identity);
        return true;
      }
      console.log('Participante sin metadata:', p.identity);
      return false;
    }
    try {
      const metadata = JSON.parse(p.metadata);
      console.log('Metadata del participante:', p.identity, metadata);
      return metadata.isHost === true || (isHost && p.identity === localParticipant.identity);
    } catch (error) {
      console.error('Error al parsear metadata del participante:', p.identity, error);
      return false;
    }
  });

  useEffect(() => {
    console.log('=== HOST PARTICIPANT UPDATE ===');
    if (hostParticipant) {
      console.log('Host encontrado:', {
        identity: hostParticipant.identity,
        metadata: hostParticipant.metadata ? JSON.parse(hostParticipant.metadata) : null,
        publications: [...hostParticipant.trackPublications.values()].map(pub => ({
          trackSid: pub.trackSid,
          kind: pub.kind,
          source: pub.source
        }))
      });
    } else {
      console.log('No se encontró host');
    }
  }, [hostParticipant]);

  // Obtener los tracks del host con logs
  const hostVideoTrack = tracks.find(track => {
    const isHostTrack = track.participant.identity === hostParticipant?.identity;
    const isVideoSource = track.source === Track.Source.Camera || track.source === Track.Source.ScreenShare;
    console.log('Evaluando track para host:', {
      trackId: track.publication?.trackSid,
      participantIdentity: track.participant.identity,
      isHostTrack,
      isVideoSource,
      source: track.source
    });
    return isHostTrack && isVideoSource;
  });

  useEffect(() => {
    console.log('=== HOST VIDEO TRACK UPDATE ===');
    console.log('Host video track:', hostVideoTrack ? {
      trackId: hostVideoTrack.publication?.trackSid,
      source: hostVideoTrack.source,
      isSubscribed: hostVideoTrack.publication?.isSubscribed,
      isMuted: hostVideoTrack.publication?.isMuted
    } : 'No se encontró video track del host');
  }, [hostVideoTrack]);

  const hostAudioTrack = tracks.find(
    track => 
      track.participant.identity === hostParticipant?.identity && 
      (track.source === Track.Source.Microphone || track.source === Track.Source.ScreenShareAudio)
  );

  useEffect(() => {
    console.log('Tracks actualizados:', tracks);
    console.log('Participantes:', participants);
    console.log('Host participant:', hostParticipant);
    console.log('Host video track:', hostVideoTrack);
  }, [tracks, participants, hostParticipant, hostVideoTrack]);

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

  // Inicialización mejorada de tracks locales
  useEffect(() => {
    if (isHost) {
      const initializeLocalTracks = async () => {
        try {
          console.log('Iniciando creación de tracks locales...');
          const tracks = await createLocalTracks({ 
            audio: true, 
            video: true
          });
          
          console.log('Tracks creados:', tracks);
          
          const videoTrack = tracks.find(t => t.kind === Track.Kind.Video) as LocalVideoTrack;
          
          if (videoTrack && localVideoEl.current) {
            try {
              await videoTrack.attach(localVideoEl.current);
              console.log('Video track adjuntado exitosamente');
              setLocalVideoTrack(videoTrack);
            } catch (attachError) {
              console.error('Error al adjuntar video track:', attachError);
              toast.error('Error al inicializar la cámara');
            }
          } else {
            console.warn('No se encontró video track o elemento de video');
          }
        } catch (error) {
          console.error('Error al inicializar tracks:', error);
          toast.error('Error al acceder a la cámara y micrófono');
        }
      };

      void initializeLocalTracks();

      // Cleanup function
      return () => {
        if (localVideoTrack) {
          localVideoTrack.detach();
          localVideoTrack.stop();
        }
      };
    }
  }, [isHost]);

  // Manejo mejorado del estado de la conexión
  useEffect(() => {
    if (roomState === ConnectionState.Connected && localParticipant) {
      console.log('Sala conectada, configurando participante local...');
      
      if (isHost) {
        const metadata = {
          isHost: true,
          name: roomMetadata?.creator_name,
          avatarUrl: roomMetadata?.creator_identity,
        };
        
        localParticipant.setMetadata(JSON.stringify(metadata))
          .then(() => console.log('Metadata del host establecida correctamente'))
          .catch(error => {
            console.error('Error al establecer metadata del participante:', error);
            toast.error('Error al configurar la transmisión');
          });
      }
    }
  }, [roomState, localParticipant, isHost, roomMetadata]);

  const handleStopStream = async () => {
    try {
      const { data } = await api.post<StopStreamResponse>('/api/stream/stop', {
        streamId: roomMetadata?.streamId,
      });

      if (data.success) {
        toast.success('Stream finalizado exitosamente');
        router.push('/dashboard');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al detener stream:', error);
      toast.error('Error al detener la transmisión');
    }
  };

  useEffect(() => {
    console.log('Room metadata:', roomMetadata);
    console.log('All participants:', participants.map(p => ({
      identity: p.identity,
      metadata: p.metadata,
      isHost: p.metadata ? JSON.parse(p.metadata)?.isHost : false
    })));
  }, [roomMetadata, participants]);

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

      {/* Controles de transmisión para el host */}
      {isHost && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-4 bg-black/60 p-4 rounded-lg">
          <MediaDeviceSettings />
          <Button 
            variant="destructive"
            onClick={handleStopStream}
          >
            Terminar Stream
          </Button>
        </div>
      )}

      {/* Vista previa local para el host */}
      {isHost && (
        <div className="absolute bottom-4 right-4 w-[300px] aspect-video bg-black/60 rounded-lg overflow-hidden">
          <video
            ref={localVideoEl}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
