import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Controller } from "@/lib/controller";

export async function POST(req: Request) {
  try {
    console.log('🎭 Starting remove from stage process');
    
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('❌ Unauthorized request');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { identity } = body;

    console.log('📝 Request data:', { identity });

    if (!identity) {
      console.log('❌ Missing identity in request');
      return new NextResponse("Identity is required", { status: 400 });
    }

    const controller = new Controller();

    // Update participant metadata to remove from stage
    await controller.updateParticipantMetadata({
      room_name: body.room_name,
      identity: identity,
      metadata: {
        hand_raised: false,
        invited_to_stage: false,
        avatarUrl: body.avatarUrl
      }
    });

    console.log('✅ Successfully removed participant from stage');

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Error removing from stage:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }), 
      { status: 500 }
    );
  }
} 