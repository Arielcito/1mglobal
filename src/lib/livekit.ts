import { AccessToken } from 'livekit-server-sdk';
import api from '@/app/libs/axios';

export async function getViewerToken(roomName: string, identity: string) {
  try {
    const { data } = await api.post('/api/stream/viewer-token', {
      room_name: roomName,
      identity: identity,
    });

    return data;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
}

export async function getHostToken(roomName: string, identity: string) {
  try {
    const { data } = await api.post('/api/stream/host-token', {
      room_name: roomName,
      identity: identity,
    });

    return data;
  } catch (error) {
    console.error('Error al obtener el token del host:', error);
    throw error;
  }
}

export function validateLivekitConnection() {
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!wsUrl) {
    throw new Error('NEXT_PUBLIC_LIVEKIT_URL no está configurado');
  }
  return wsUrl;
}

export type ConnectionDetails = {
  token: string;
  ws_url: string;
}; 