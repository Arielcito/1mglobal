export function validateEnvVars() {
  const required = [
    'LIVEKIT_API_KEY',
    'LIVEKIT_API_SECRET',
    'LIVEKIT_WS_URL'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate URL format
  try {
    const wsUrl = process.env.LIVEKIT_WS_URL;
    if (!wsUrl?.startsWith('ws://') && !wsUrl?.startsWith('wss://')) {
      throw new Error('LIVEKIT_WS_URL must start with ws:// or wss://');
    }
  } catch (error) {
    throw new Error('Invalid LIVEKIT_WS_URL format');
  }

  return {
    LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY as string,
    LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET as string,
    LIVEKIT_WS_URL: process.env.LIVEKIT_WS_URL as string,
  };
} 