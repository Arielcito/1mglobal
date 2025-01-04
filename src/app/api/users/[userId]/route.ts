import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return new NextResponse("ID de usuario no proporcionado", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        image: true,
      }
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
} 