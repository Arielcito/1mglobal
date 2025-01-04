import { AccessToken } from 'livekit-server-sdk';

export async function getViewerToken(roomName: string, identity: string) {
  try {
    const response = await fetch('/api/stream/viewer-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room_name: roomName,
        identity: identity,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
}

export async function getHostToken(roomName: string, identity: string) {
  try {
    const response = await fetch('/api/stream/host-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room_name: roomName,
        identity: identity,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el token del host');
    }

    const data = await response.json();
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