export interface Stream {
  id: string;
  title: string;
  description?: string;
  name: string;
  userId: string;
  isLive: boolean;
  thumbnailUrl?: string;
  ingressId?: string;
  serverUrl?: string;
  streamKey?: string;
  user: {
    name: string;
    image: string;
  };
}

export interface CreateStreamDTO {
  name: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface UpdateStreamDTO {
  title?: string;
  description?: string;
  isLive?: boolean;
  thumbnailUrl?: string;
} 