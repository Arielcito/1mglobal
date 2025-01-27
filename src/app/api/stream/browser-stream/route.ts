import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { room_name, metadata } = body;

    // Crear el stream en la base de datos
    const stream = await db.stream.create({
      data: {
        name: room_name,
        title: metadata.title,
        description: metadata.description,
        thumbnailUrl: metadata.thumbnailUrl,
        userId: metadata.creator_identity,
        streamMethod: 'browser',
        isLive: true, // Se marca como live inmediatamente ya que es streaming desde navegador
      },
    });

    // Crear token para el host con permisos de publicación
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: metadata.creator_identity,
        name: metadata.creator_name,
      }
    );

    at.addGrant({
      room: room_name,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    const token = at.toJwt();

    return NextResponse.json({
      stream,
      token,
      ws_url: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      metadata: {
        ...metadata,
        streamId: stream.id,
        room_name,
      },
    });
  } catch (error) {
    console.error('[BROWSER_STREAM_CREATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 