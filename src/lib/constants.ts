export const STREAM_KEYS = {
  streamKey: (userId: string) => ['streamKey', userId],
  serverUrl: (userId: string) => ['serverUrl', userId],
} as const; 