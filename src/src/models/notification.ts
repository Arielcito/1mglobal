import { prisma } from "@/lib/prisma"
import { Notification, Prisma } from "@prisma/client"

export const NotificationModel = {
  async getById(id: number): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { notification_id: id }
    })
  },

  async getByUser(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })
  },

  async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
    return prisma.notification.create({ data })
  },

  async markAsRead(id: number): Promise<Notification> {
    return prisma.notification.update({
      where: { notification_id: id },
      data: { is_read: true }
    })
  },

  async delete(id: number): Promise<Notification> {
    return prisma.notification.delete({
      where: { notification_id: id }
    })
  }
} 