import { prisma } from "@/lib/prisma"
import { Membership, Prisma } from "@prisma/client"

export const MembershipModel = {
  async getById(id: number): Promise<Membership | null> {
    return prisma.membership.findUnique({
      where: { membership_id: id }
    })
  },

  async getActiveByUser(userId: string): Promise<Membership | null> {
    return prisma.membership.findFirst({
      where: {
        user_id: userId,
        is_active: true,
        end_date: {
          gte: new Date()
        }
      }
    })
  },

  async create(data: Prisma.MembershipCreateInput): Promise<Membership> {
    return prisma.membership.create({ data })
  },

  async update(id: number, data: Prisma.MembershipUpdateInput): Promise<Membership> {
    return prisma.membership.update({
      where: { membership_id: id },
      data
    })
  },

  async deactivate(id: number): Promise<Membership> {
    return prisma.membership.update({
      where: { membership_id: id },
      data: { is_active: false }
    })
  }
} 