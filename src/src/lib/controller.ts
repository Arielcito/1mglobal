// forked from livestream-mobile-backend

import jwt from "jsonwebtoken";
import {
  AccessToken,
  type CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressAudioOptions,
  IngressClient,
  type IngressInfo,
  IngressInput,
  IngressVideoEncodingPreset,
  IngressVideoOptions,
  type ParticipantInfo,
  type ParticipantPermission,
  RoomServiceClient,
  TrackSource,
} from "livekit-server-sdk";

export type RoomMetadata = {
  creator_identity: string;
  enable_chat: boolean;
  allow_participation: boolean;
};

export type ParticipantMetadata = {
  hand_raised: boolean;
  invited_to_stage: boolean;
  avatarUrl?: string;
};

export type Config = {
  ws_url: string;
  api_key: string;
  api_secret: string;
};

export type Session = {
  identity: string;
  room_name: string;
};

export type ConnectionDetails = {
  token: string;
  ws_url: string;
};

export type CreateIngressParams = {
  room_name?: string;
  ingress_type: string;
  metadata: RoomMetadata;
};

export type CreateIngressResponse = {
  ingress: IngressInfo;
  auth_token: string;
  connection_details: ConnectionDetails;
};

export type CreateStreamParams = {
  room_name?: string;
  metadata: RoomMetadata;
};

export type CreateStreamResponse = {
  auth_token: string;
  connection_details: ConnectionDetails;
};

export type JoinStreamParams = {
  room_name: string;
  identity: string;
};

export type JoinStreamResponse = {
  auth_token: string;
  connection_details: ConnectionDetails;
};

export type InviteToStageParams = {
  identity: string;
};

export type RemoveFromStageParams = {
  identity?: string;
};

export type ErrorResponse = {
  error: string;
};

export type UpdateParticipantMetadataParams = {
  room_name: string;
  identity: string;
  metadata: ParticipantMetadata;
};

export function getSessionFromReq(req: Request): Session {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    throw new Error("No authorization header found");
  }
  const verified = jwt.verify(token, process.env.LIVEKIT_API_SECRET ?? "");
  if (!verified) {
    throw new Error("Invalid token");
  }
  const decoded = jwt.decode(token) as Session;
  return decoded;
}

export class Controller {
  private ingressService: IngressClient;
  private roomService: RoomServiceClient;
  private apiKey: string;
  private apiSecret: string;
  private wsUrl: string;

  constructor() {
    // Validate environment variables
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_WS_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      throw new Error('Missing LiveKit configuration. Please check your environment variables.');
    }

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.wsUrl = wsUrl;

    // Convert WebSocket URL to HTTP URL
    const httpUrl = wsUrl
      .replace("wss://", "https://")
      .replace("ws://", "http://");
    console.log('wsUrl', wsUrl);
    console.log('apiKey', this.apiKey);
    console.log('apiSecret', this.apiSecret);
    // Initialize services with API key and secret
    this.ingressService = new IngressClient(httpUrl, this.apiKey, this.apiSecret);
    this.roomService = new RoomServiceClient(
      httpUrl,
      this.apiKey,
      this.apiSecret
    );
  }

  async deleteExistingIngresses(roomName: string) {
    const ingresses = await this.ingressService.listIngress();
    
    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        await this.ingressService.deleteIngress(ingress.ingressId);
      }
    }
  }

  async createIngress({
    metadata,
    room_name,
    ingress_type = "rtmp",
  }: CreateIngressParams): Promise<CreateIngressResponse> {
    console.log('Starting createIngress with params:', { metadata, room_name, ingress_type });

    if (!room_name) {
      room_name = generateRoomId();
      console.log('Generated room name:', room_name);
    }
    console.log('room_name', room_name);
    try {
      const ingresses = await this.ingressService.listIngress();
      console.log('Found ingresses:', ingresses);
      // Delete any existing ingresses for this room first
      await this.deleteExistingIngresses(room_name);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create room
      console.log('Creating room with name:', room_name);
      await this.roomService.createRoom({
        name: room_name,
        metadata: JSON.stringify(metadata),
      });
      console.log('Room created successfully');

      // Prepare ingress options
      console.log('Preparing ingress options');
      const options: CreateIngressOptions = {
        name: room_name,
        roomName: room_name,
        participantName: `${metadata.creator_identity} (via OBS)`,
        participantIdentity: metadata.creator_identity,
      };

      if (ingress_type === "whip") {
        console.log('Configuring WHIP ingress options');
        options.enableTranscoding = false;
      } else {
        console.log('Configuring RTMP ingress options');
        try {
          options.video = new IngressVideoOptions({
            source: TrackSource.CAMERA,
            encodingOptions: {
              case: 'preset',
              value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
            },
          });
          
          options.audio = new IngressAudioOptions({
            source: TrackSource.MICROPHONE,
            encodingOptions: {
              case: 'preset',
              value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
            }
          });
          console.log('Video and audio options configured successfully');
        } catch (error) {
          console.error('Error configuring video/audio options:', error);
          throw error;
        }
      }

      console.log('Final ingress options:', JSON.stringify(options, null, 2));

      // Create ingress
      console.log('Creating ingress with type:', ingress_type);
      const ingress = await this.ingressService.createIngress(
        ingress_type === "whip" ? IngressInput.WHIP_INPUT : IngressInput.RTMP_INPUT,
        options
      );
      console.log('Ingress created successfully:', ingress);

      // Create viewer access token
      console.log('Creating access token');
      const at = new AccessToken(
        this.apiKey,
        this.apiSecret,
        {
          identity: metadata.creator_identity,
        }
      );

      at.addGrant({
        room: room_name,
        roomJoin: true,
        canPublish: false,
        canSubscribe: true,
        canPublishData: true,
      });
      console.log('Access token created and configured');

      const authToken = this.createAuthToken(
        room_name,
        metadata.creator_identity
      );
      console.log('Auth token created');

      const response = {
        ingress,
        auth_token: authToken,
        connection_details: {
          ws_url: this.wsUrl,
          token: await at.toJwt(),
        },
      };
      console.log('Response prepared successfully');

      return response;
    } catch (error: any) {
      console.error('Error in createIngress:', error);
      
      // Handle rate limiting specifically
      if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }

      // Handle other common LiveKit errors
      if (error.message?.includes('already exists')) {
        throw new Error('A stream with this name already exists. Please try a different name.');
      }

      throw error;
    }
  }

  async stopStream(session: Session) {
    const rooms = await this.roomService.listRooms([session.room_name]);

    if (rooms.length === 0) {
      throw new Error("Room does not exist");
    }

    const room = rooms[0];
    const creator_identity = (JSON.parse(room.metadata) as RoomMetadata)
      .creator_identity;

    if (creator_identity !== session.identity) {
      throw new Error("Only the creator can invite to stage");
    }

    await this.roomService.deleteRoom(session.room_name);
  }

  async joinStream({
    identity,
    room_name,
  }: JoinStreamParams): Promise<JoinStreamResponse> {
    // Check for existing participant with same identity
    let exists = false;
    try {
      await this.roomService.getParticipant(room_name, identity);
      exists = true;
    } catch {}

    if (exists) {
      throw new Error("Participant already exists");
    }

    const at = new AccessToken(
      this.apiKey,
      this.apiSecret,
      {
        identity,
      }
    );

    at.addGrant({
      room: room_name,
      roomJoin: true,
      canPublish: false,
      canSubscribe: true,
      canPublishData: true,
    });

    const authToken = this.createAuthToken(room_name, identity);

    return {
      auth_token: authToken,
      connection_details: {
        ws_url: this.wsUrl,
        token: await at.toJwt(),
      },
    };
  }

  getOrCreateParticipantMetadata(
    participant: ParticipantInfo
  ): ParticipantMetadata {
    if (participant.metadata) {
      return JSON.parse(participant.metadata) as ParticipantMetadata;
    }
    return {
      hand_raised: false,
      invited_to_stage: false,
      avatarUrl: `https://api.multiavatar.com/${participant.identity}.png`,
    };
  }
  createAuthToken(room_name: string, identity: string) {
    return jwt.sign(
      JSON.stringify({ room_name, identity }),
      this.apiSecret
    );
  }

  async updateParticipantMetadata({
    room_name,
    identity,
    metadata
  }: UpdateParticipantMetadataParams) {
    console.log('🔄 Updating participant metadata:', {
      room_name,
      identity,
      metadata
    });

    try {
      const rooms = await this.roomService.listRooms([room_name]);
      
      if (rooms.length === 0) {
        console.error('❌ Room not found:', room_name);
        throw new Error("Room not found");
      }

      const room = rooms[0];
      
      // Update participant metadata
      await this.roomService.updateParticipant(room_name, identity, {
        metadata: JSON.stringify(metadata)
      });

      console.log('✅ Successfully updated participant metadata');
      
      return true;
    } catch (error) {
      console.error('❌ Error updating participant metadata:', error);
      throw error;
    }
  }
}

function generateRoomId(): string {
  return `${randomString(4)}-${randomString(4)}`;
}

function randomString(length: number): string {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
