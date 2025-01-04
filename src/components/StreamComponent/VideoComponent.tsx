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
} from 'livekit-client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VideoComponentProps {
  isHost?: boolean;
}

export default function VideoComponent({ isHost = false }: VideoComponentProps) {
  const { metadata, state: roomState } = useRoomContext();
  const roomMetadata = metadata ? JSON.parse(metadata) as RoomMetadata : null;
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  
  const remoteVideoTracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const remoteAudioTracks = useTracks([Track.Source.Microphone, Track.Source.ScreenShareAudio]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  return (
    <div className="relative h-full w-full bg-black">
      {roomState !== ConnectionState.Connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center p-4">
            <p className="text-white mb-4">Conectando al servidor de streaming...</p>
          </div>
        </div>
      )}

      <div className="grid w-full h-full absolute gap-2">
        {remoteVideoTracks.map((track) => (
          <div key={track.participant.identity} className="relative">
            <div className="absolute w-full h-full flex items-center justify-center">
              <Avatar className="h-36 w-36">
                <AvatarImage src={track.participant.metadata ? JSON.parse(track.participant.metadata).avatarUrl : undefined} />
                <AvatarFallback>{track.participant.identity[0] ?? "?"}</AvatarFallback>
              </Avatar>
            </div>
            <VideoTrack
              trackRef={track}
              className={cn(
                "h-full w-full object-cover",
                track.source === Track.Source.ScreenShare ? "object-contain" : "object-cover"
              )}
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <Badge variant="secondary" className="bg-black/60">
                {track.participant.identity}
              </Badge>
              {track.source === Track.Source.ScreenShare && (
                <Badge variant="secondary" className="bg-black/60">
                  Compartiendo pantalla
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {remoteAudioTracks.map((track) => (
        <AudioTrack key={track.participant.identity} trackRef={track} />
      ))}

      <StartAudio label="Haz clic para activar el audio" />
    </div>
  );
}
