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
    
    try {
      // Obtener los headers necesarios
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        console.error('❌ No authorization header present');
        return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
      }

      // Verificar y procesar el webhook
      const event = await receiver.receive(body, authHeader);
      console.log('📦 Webhook event received:', event.event);

      // Manejar eventos de sala
      if (event.event === 'room_started') {
        console.log('🎥 Room started:', event.room);
        // Aquí puedes agregar la lógica para manejar el inicio de una sala
      }

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

      return NextResponse.json({ message: 'Webhook processed successfully' })
    } catch (verifyError) {
      console.error('❌ Error verifying webhook:', verifyError);
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 })
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
