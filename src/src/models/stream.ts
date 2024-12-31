import { prisma } from "@/lib/prisma"
import { Stream, Prisma } from "@prisma/client"

export const StreamModel = {
  async getByUserId(userId: string): Promise<Stream | null> {
    return prisma.stream.findUnique({
      where: { userId }
    })
  },

  async create(data: Prisma.StreamCreateInput): Promise<Stream> {
    return prisma.stream.create({ data })
  },

  async update(id: string, data: Prisma.StreamUpdateInput): Promise<Stream> {
    return prisma.stream.update({
      where: { id },
      data
    })
  },

  async delete(id: string): Promise<Stream> {
    return prisma.stream.delete({
      where: { id }
    })
  },

  async updateStreamStatus(id: string, isLive: boolean): Promise<Stream> {
    return prisma.stream.update({
      where: { id },
      data: { isLive }
    })
  },

  async getLiveStreams(): Promise<Stream[]> {
    return prisma.stream.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  }
} 