import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { room_name } = await req.json();
    if (!room_name) {
      return new NextResponse("Se requiere el nombre de la sala", { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return new NextResponse("Error de configuración del servidor", { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: session.user.id,
      name: session.user.name || undefined,
      metadata: JSON.stringify({
        name: session.user.name,
        avatarUrl: session.user.image,
      }),
    });

    at.addGrant({
      room: room_name,
      roomJoin: true,
      canPublish: false,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({
      token: await at.toJwt(),
      ws_url: wsUrl,
    });
  } catch (error) {
    console.error("[VIEWER_TOKEN_ERROR]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
} 