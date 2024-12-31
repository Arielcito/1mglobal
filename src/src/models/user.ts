import { prisma } from "@/lib/prisma"
import { User, Prisma } from "@prisma/client"

export const UserModel = {
  async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    })
  },

  async getByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  },

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    })
  },

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id }
    })
  }
} 