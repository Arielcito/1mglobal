import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("[STREAMS_GET] Fetching live streams")
  
  try {
    const streams = await db.stream.findMany({
      where: {
        isLive: true
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })
    
    console.log("[STREAMS_GET] Found streams:", streams.length)
    console.log("[STREAMS_GET] Streams data:", streams)

    return NextResponse.json(streams)
  } catch (error) {
    console.error("[STREAMS_GET] Error fetching streams:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 