import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }

    const stream = await db.stream.findFirst({
      where: {
        userId: params.userId,
      },
      select: {
        id: true,
        streamKey: true,
        serverUrl: true,
        userId: true,
        isLive: true,
        isChatEnabled: true,
        isChatDelayed: true,
        thumbnail_url: true,
        name: true,
      }
    })

    if (!stream) {
      return new NextResponse("Stream not found", { status: 404 })
    }

    return NextResponse.json(stream)
  } catch (error) {
    console.error("[STREAM_GET_BY_USER]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 