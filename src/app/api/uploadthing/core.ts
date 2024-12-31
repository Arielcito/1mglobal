import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { useAuth } from "@/context/AuthContext";

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
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
