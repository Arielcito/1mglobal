import { AccessToken } from 'livekit-server-sdk'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  console.log("[LIVEKIT_TOKEN] Starting token generation process")
  
  try {
    // Log environment variables (sin exponer valores sensibles)
    console.log("[LIVEKIT_TOKEN] Environment check:", {
      hasApiKey: !!process.env.LIVEKIT_API_KEY,
      hasApiSecret: !!process.env.LIVEKIT_API_SECRET,
      hasWsUrl: !!process.env.NEXT_PUBLIC_LIVEKIT_URL,
    })

    const session = await getServerSession(authOptions)
    console.log("[LIVEKIT_TOKEN] Session data:", {
      hasSession: !!session,
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
    })
    
    if (!session?.user) {
      console.log("[LIVEKIT_TOKEN] Error: No session found")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const room = searchParams.get('room')
    const username = session.user.name || 'anonymous'
  

    if (!room) {
      console.log("[LIVEKIT_TOKEN] Error: Missing room parameter")
      return new NextResponse("Missing 'room' query parameter", { status: 400 })
    }

    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      console.error("[LIVEKIT_TOKEN] Error: Missing LiveKit credentials")
      throw new Error("LiveKit credentials not configured")
    }

    // Create a new token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: session.user.username,
        name: username,
      }
    )

    at.addGrant({ 
      room,
      roomJoin: true,
      canPublish: false,
      canPublishData: true 
    })

    const token = await at.toJwt()

    return NextResponse.json({ 
      token,
      room,
      identity: session.user.username,
      name: username,
    })

  } catch (error) {
    console.error("[LIVEKIT_TOKEN] Error details:", {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : 'Unknown error message',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })

    // Log the full error object in development
    if (process.env.NODE_ENV === 'development') {
      console.error("[LIVEKIT_TOKEN] Full error object:", error)
    }

    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
} 