import { prisma } from "@/lib/prisma"
import { WebhookReceiver } from "livekit-server-sdk"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"

import { NextResponse } from "next/server"

const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY ?? '',
    process.env.LIVEKIT_API_SECRET ?? '',
)

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Webhook request received from LiveKit');
    const body = await request.text()
    const headerPayload = headers()
    const authorization = headerPayload.get('Authorization')

    if(!authorization || !authorization.startsWith('Bearer ')) {
      console.log('❌ Unauthorized webhook request');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔐 Authorization valid, processing webhook...');
    const event = await receiver.receive(body, authorization);
    console.log('📦 Webhook event received:', event.event);

    if(event.event === 'ingress_started') {
      console.log('🎥 Stream started:', event.ingressInfo?.ingressId);
      await prisma.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId
        },
        data: {
          isLive: true
        }
      })
      console.log('✅ Database updated - Stream is now live');
    }

    if(event.event === 'ingress_ended') {
      console.log('🛑 Stream ended:', event.ingressInfo?.ingressId);
      await prisma.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId
        },
        data: {
          isLive: false
        }
      })
      console.log('✅ Database updated - Stream is now offline');
    }

    return NextResponse.json({ message: 'Webhook received' })
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
