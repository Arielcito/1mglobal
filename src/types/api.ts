export interface Stream {
  id: string;
  title: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  isLive: boolean;
  userId: string;
  ingressId?: string;
  serverUrl?: string;
  streamKey?: string;
  user: {
    name: string;
    image: string;
  };
}

export interface CreateStreamResponse {
  room_name: string;
  token: string;
  auth_token: string;
  ws_url: string;
  ingress: {
    ingressId: string;
    url: string;
    streamKey: string;
  } | null;
  stream: Stream;
}

export interface StopStreamResponse {
  success: boolean;
  message: string;
  details: {
    streamId: string;
    roomName: string | null;
  };
}

export interface ViewerTokenResponse {
  token: string;
  auth_token: string;
  ws_url: string;
}

export interface StreamFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  streamMethod: 'browser' | 'external';
  role: 'host' | 'viewer';
} 