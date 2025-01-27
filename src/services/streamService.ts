import api from '@/app/libs/axios';
import type { CreateStreamResponse, StopStreamResponse, Stream } from '@/types/api';

export const streamService = {
  createBrowserStream: async (params: {
    room_name: string;
    metadata: {
      title: string;
      description?: string;
      thumbnailUrl?: string;
      creator_identity: string;
      creator_name: string;
      isHost: boolean;
    }
  }) => {
    const { data } = await api.post<CreateStreamResponse>('/api/stream/browser-stream', params);
    return data;
  },

  stopStream: async (streamId: string) => {
    const { data } = await api.post<StopStreamResponse>('/api/stream/stop', { streamId });
    return data;
  },

  getStream: async (streamId: string) => {
    const { data } = await api.get<Stream>(`/api/stream/${streamId}`);
    return data;
  }
}; 