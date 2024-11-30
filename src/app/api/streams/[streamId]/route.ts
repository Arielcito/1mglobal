import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { streamId: string } }
) {
  try {
    if (!params.streamId) {
      return new NextResponse("Stream ID is required", { status: 400 })
    }

    const stream = await db.stream.findUnique({
      where: {
        id: params.streamId,
      },
      select: {
        id: true,
        name: true,
        streamKey: true,
        serverUrl: true,
        userId: true,
        isLive: true,
        isChatEnabled: true,
        isChatDelayed: true,
        thumbnail_url: true,
        title: true,
        description: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          }
        }
      }
    })

    if (!stream) {
      return new NextResponse("Stream not found", { status: 404 })
    }

    return NextResponse.json(stream)
  } catch (error) {
    console.error("[STREAM_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 