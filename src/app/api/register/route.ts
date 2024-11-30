import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    console.log("🚀 Iniciando proceso de registro");
    
    const body = await request.json();
    const { name, email, password } = body;
    
    console.log("📝 Datos recibidos:", { 
      name, 
      email, 
      password: password ? "***" : undefined 
    });

    if (!name || !email || !password) {
      console.error("❌ Campos faltantes:", { 
        name: !name, 
        email: !email, 
        password: !password 
      });
      return new NextResponse(
        JSON.stringify({ error: "Todos los campos son requeridos" }), 
        { status: 400 }
      );
    }

    console.log("🔍 Verificando si el email ya existe...");
    const exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exist) {
      console.error("❌ Email ya registrado:", email);
      return new NextResponse(
        JSON.stringify({ error: "Este correo electrónico ya está registrado" }), 
        { status: 400 }
      );
    }

    console.log("🔒 Hasheando contraseña...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("👤 Creando usuario en la base de datos...");
    const user = await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
      },
    }).catch(error => {
      console.error("❌ Error al crear usuario en Prisma:", error);
      throw error;
    });

    console.log("✅ Usuario creado exitosamente:", {
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin
    });

    return NextResponse.json(user);
    
  } catch (error) {
    console.error("❌ Error general en el registro:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error desconocido en el registro'
      }), 
      { status: 500 }
    );
  }
}
