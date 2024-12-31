"use client";

import { useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import type { ParticipantMetadata, RoomMetadata } from "@/lib/controller";
import {
  AudioTrack,
  StartAudio,
  VideoTrack,
  useDataChannel,
  useLocalParticipant,
  useMediaDeviceSelect,
  useParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import { 
  ConnectionState, 
  type LocalVideoTrack, 
  Track, 
  createLocalTracks 
} from "livekit-client";
import { Copy, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Confetti from "js-confetti";

function ConfettiCanvas() {
  const [confetti, setConfetti] = useState<Confetti>();
  const [decoder] = useState(() => new TextDecoder());
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useDataChannel("reactions", (data) => {
    const options: { emojis?: string[]; confettiNumber?: number } = {};

    if (decoder.decode(data.payload) !== "🎉") {
      options.emojis = [decoder.decode(data.payload)];
      options.confettiNumber = 12;
    }

    confetti?.addConfetti(options);
  });

  useEffect(() => {
    setConfetti(new Confetti({ canvas: canvasEl?.current ?? undefined }));
  }, []);

  return <canvas ref={canvasEl} className="absolute h-full w-full" />;
}

interface VideoComponentProps {
  isHost?: boolean;
}

export default function VideoComponent({ isHost = false }: VideoComponentProps) {
  const [_, copy] = useCopyToClipboard();
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack>();
  const localVideoEl = useRef<HTMLVideoElement>(null);

  const { metadata, name: roomName, state: roomState } = useRoomContext();
  const roomMetadata = metadata ? JSON.parse(metadata) as RoomMetadata : null;
  const { localParticipant } = useLocalParticipant();
  const localMetadata = localParticipant.metadata 
    ? JSON.parse(localParticipant.metadata) as ParticipantMetadata 
    : null;

  const canHost = isHost || (localMetadata?.invited_to_stage && localMetadata?.hand_raised);
  const participants = useParticipants();
  
  const showNotification = isHost
    ? participants.some((p) => {
        const metadata = p.metadata 
          ? JSON.parse(p.metadata) as ParticipantMetadata 
          : null;
        return metadata?.hand_raised && !metadata?.invited_to_stage;
      })
    : localMetadata?.invited_to_stage && !localMetadata?.hand_raised;

  useEffect(() => {
    if (canHost) {
      const createTracks = async () => {
        const tracks = await createLocalTracks({ audio: true, video: true });
        const camTrack = tracks.find((t) => t.kind === Track.Kind.Video);
        if (camTrack && localVideoEl?.current) {
          camTrack.attach(localVideoEl.current);
        }
        setLocalVideoTrack(camTrack as LocalVideoTrack);
      };
      void createTracks();
    }
  }, [canHost]);

  const { activeDeviceId: activeCameraDeviceId } = useMediaDeviceSelect({
    kind: "videoinput",
  });

  useEffect(() => {
    if (localVideoTrack) {
      void localVideoTrack.setDeviceId(activeCameraDeviceId);
    }
  }, [localVideoTrack, activeCameraDeviceId]);

  const remoteVideoTracks = useTracks([Track.Source.Camera]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const remoteAudioTracks = useTracks([Track.Source.Microphone]).filter(
    (t) => t.participant.identity !== localParticipant.identity
  );

  const handleLeaveStage = async () => {
    try {
      await fetch("/api/remove_from_stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identity: localParticipant.identity,
        }),
      });
    } catch (error) {
      console.error("Error leaving stage:", error);
    }
  };

  return (
    <div className="relative h-full w-full bg-black">
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
              className="absolute w-full h-full bg-transparent"
            />
            <div className="absolute w-full h-full">
              <Badge
                variant="outline"
                className="absolute bottom-2 right-2 bg-black/60"
              >
                {track.participant.identity}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {remoteAudioTracks.map((track) => (
        <AudioTrack key={track.participant.identity} trackRef={track} />
      ))}

      <ConfettiCanvas />

      <StartAudio
        label="Click para permitir el audio"
        className="absolute top-0 h-full w-full bg-black/80 text-white flex items-center justify-center"
      />

      <div className="absolute top-0 w-full p-4">
        <div className="flex justify-end items-end">
          <div className="flex items-center gap-2">
            {roomState === ConnectionState.Connected && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs uppercase text-zinc-400">
                  En vivo
                </span>
              </div>
            )}

            <div className="relative">
              {showNotification && (
                <div className="absolute -top-1 -right-1">
                  <div className="flex h-3 w-3">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative h-3 w-3 rounded-full bg-primary" />
                  </div>
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                disabled={roomState !== ConnectionState.Connected}
                className="bg-black/60"
              >
                {roomState === ConnectionState.Connected ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {roomState === ConnectionState.Connected
                    ? participants.length
                    : ""}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {roomName && canHost && roomMetadata?.creator_identity !== localParticipant.identity && (
        <div className="absolute bottom-4 left-4">
          <Button 
            size="lg"
            variant="destructive"
            onClick={handleLeaveStage}
          >
            Abandonar escenario
          </Button>
        </div>
      )}
    </div>
  );
}
