import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { useAuth } from "@/context/AuthContext";
import { processVideo } from "@/services/videoProcessor";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata, url: file.url };
    }),
    
  videoUploader: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(async () => {
      const {user} = useAuth()
      if (!user) throw new Error("No autorizado");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Procesar el video con FFmpeg
        const hlsPath = await processVideo(file.url);
        
        // Guardar la URL del video procesado
        const videoUrl = `/videos/${file.name}/master.m3u8`;
        
        return { 
          uploadedBy: metadata.userId, 
          url: videoUrl,
          originalUrl: file.url 
        };
      } catch (error) {
        console.error('Error al procesar el video:', error);
        // Si falla el procesamiento, devolver la URL original
        return { uploadedBy: metadata.userId, url: file.url };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
