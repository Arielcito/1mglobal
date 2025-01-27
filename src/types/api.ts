export interface Stream {
  id: string;
  name: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  isLive: boolean;
  userId: string;
  streamMethod: 'browser' | 'external';
  createdAt: string;
  updatedAt: string;
}

export interface StopStreamResponse {
  success: boolean;
  message: string;
}

export interface CreateStreamResponse {
  stream: Stream;
  token: string;
  ws_url: string;
  metadata: {
    streamId: string;
    room_name: string;
    creator_identity: string;
    creator_name: string;
    title: string;
    description?: string;
    isHost: boolean;
  };
} 