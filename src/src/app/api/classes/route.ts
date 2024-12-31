import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ClassModel } from "@/models/class"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!session?.user?.email) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    if (!courseId) {
      return new NextResponse("Se requiere el ID del curso", { status: 400 })
    }

    const classes = await ClassModel.getByCourse(parseInt(courseId), {
      includeTeacher: true,
      includeStudents: true,
      orderBy: 'date'
    })
             

    return NextResponse.json(classes)
  } catch (error) {
    console.error("[CLASSES_GET]", error)
    return new NextResponse("Error interno del servidor", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const order = Number(data.order);
    
    if (isNaN(order)) {
      return NextResponse.json(
        { error: "El orden debe ser un número válido" },
        { status: 400 }
      );
    }
    
    const newClass = await ClassModel.create({
      title: data.title,
      description: data.description,
      content: data.content,
      duration: data.duration,
      order: order,
      course: {
        connect: {
          course_id: data.courseId
        }
      },
      status: data.status,
      recording_url: data.videoUrl,
      is_live: data.isLive,
      scheduled_at: data.scheduledAt ? new Date(data.scheduledAt) : null,
    });

    return NextResponse.json(newClass);
  } catch (error) {
    console.error("Error al crear la clase:", error);
    return NextResponse.json(
      { error: "Error al crear la clase" },
      { status: 500 }
    );
  }
}
