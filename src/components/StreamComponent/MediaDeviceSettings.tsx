"use client";

import { useState, useEffect } from "react";
import { useLocalParticipant, useMediaDeviceSelect } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mic, MicOff, Video, VideoOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MediaDeviceSettings() {
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const { localParticipant } = useLocalParticipant();

  const {
    devices: microphoneDevices,
    activeDeviceId: activeMicrophoneId,
    setActiveMediaDevice: setActiveMicrophone,
  } = useMediaDeviceSelect({ kind: "audioinput" });

  const {
    devices: cameraDevices,
    activeDeviceId: activeCameraId,
    setActiveMediaDevice: setActiveCamera,
  } = useMediaDeviceSelect({ kind: "videoinput" });

  useEffect(() => {
    if (localParticipant) {
      void localParticipant.setMicrophoneEnabled(micEnabled);
      void localParticipant.setCameraEnabled(camEnabled);
    }
  }, [micEnabled, camEnabled, localParticipant]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMicEnabled(!micEnabled)}
        className={cn(!micEnabled && "bg-red-500/20")}
      >
        {micEnabled ? <Mic /> : <MicOff />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setCamEnabled(!camEnabled)}
        className={cn(!camEnabled && "bg-red-500/20")}
      >
        {camEnabled ? <Video /> : <VideoOff />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">Micrófono</h4>
            {microphoneDevices.map((device) => (
              <DropdownMenuItem
                key={device.deviceId}
                onClick={() => setActiveMicrophone(device.deviceId)}
                className={cn(
                  "cursor-pointer",
                  device.deviceId === activeMicrophoneId && "bg-accent"
                )}
              >
                {device.label}
              </DropdownMenuItem>
            ))}
          </div>
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">Cámara</h4>
            {cameraDevices.map((device) => (
              <DropdownMenuItem
                key={device.deviceId}
                onClick={() => setActiveCamera(device.deviceId)}
                className={cn(
                  "cursor-pointer",
                  device.deviceId === activeCameraId && "bg-accent"
                )}
              >
                {device.label}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 