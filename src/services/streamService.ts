import api from '@/app/libs/axios';
import type { CreateStreamResponse, StopStreamResponse, Stream, ViewerTokenResponse } from '@/types/api';

export const streamService = {
  getLiveStreams: async () => {
    const { data } = await api.get<Stream[]>('/api/stream/live');
    return data;
  },

  createStream: async (params: {
    room_name?: string;
    ingress_type?: 'whip' | 'rtmp';
    metadata?: {
      title?: string;
      description?: string;
      thumbnailUrl?: string;
    };
  }) => {
    const { data } = await api.post<CreateStreamResponse>('/api/stream/create', params);
    return data;
  },

  createBrowserStream: async (params: {
    room_name?: string;
    metadata?: {
      title?: string;
      description?: string;
      thumbnailUrl?: string;
    };
  }) => {
    const { data } = await api.post<CreateStreamResponse>('/api/stream/browser-stream', params);
    return data;
  },

  stopStream: async () => {
    const { data } = await api.post<StopStreamResponse>('/api/stream/stop');
    return data;
  },

  getViewerToken: async (room_name: string) => {
    const { data } = await api.post<ViewerTokenResponse>('/api/stream/viewer-token', { room_name });
    return data;
  },

  getStream: async (streamId: string) => {
    const { data } = await api.get<Stream>(`/api/stream/${streamId}`);
    return data;
  }
}; 