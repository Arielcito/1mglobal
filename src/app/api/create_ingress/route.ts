import { Controller, type CreateIngressParams } from "@/lib/controller";
import { db } from "@/lib/db";
import { validateEnvVars } from "@/lib/env-check";

export async function POST(req: Request) {
  
  try {
    const controller = new Controller();
    const reqBody = await req.json();
    
    const response = await controller.createIngress(
      reqBody as CreateIngressParams
    );
    const stream = await db.stream.findUnique({
      where: {
        userId: reqBody.user_id
      }
    })
    
    if (stream) {
      await db.stream.update({
        where: { userId: reqBody.user_id },
        data: { 
          name: response.ingress.name,
          title: reqBody.title,
          description: reqBody.description,
          ingressId: response.ingress.ingressId,
          serverUrl: response.ingress.url,
          streamKey: response.ingress.streamKey,
          isLive: true,
          created_at: new Date()
        }
      });
    } else {
      await db.stream.create({
        data: {
          title: reqBody.title,
          description: reqBody.description,
          userId: reqBody.user_id,
          ingressId: response.ingress.ingressId,
          serverUrl: response.ingress.url,
          streamKey: response.ingress.streamKey,
          isLive: true,
          name: response.ingress.name,
          thumbnail_url: null, // O una URL por defecto si lo prefieres
        }
      });
    }

    return Response.json(response);
    
  } catch (err) {
    console.error('Detailed error in create_ingress:', {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? err instanceof Error ? err.stack : undefined : undefined,
    });

    if (err instanceof Error) {
      return Response.json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
      }, { 
        status: 500 
      });
    }

    return Response.json({ 
      error: 'Unknown error occurred',
      details: JSON.stringify(err)
    }, { 
      status: 500 
    });
  }
}
