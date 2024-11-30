import { prisma } from "@/lib/prisma"
import { Enrollment, Prisma } from "@prisma/client"

export const EnrollmentModel = {
  async getById(id: number): Promise<Enrollment | null> {
    return prisma.enrollment.findUnique({
      where: { enrollment_id: id },
      include: {
        user: true,
        course: true
      }
    })
  },

  async getByUserAndCourse(userId: string, courseId: number): Promise<Enrollment | null> {
    return prisma.enrollment.findFirst({
      where: {
        user_id: userId,
        course_id: courseId
      }
    })
  },

  async create(data: Prisma.EnrollmentCreateInput): Promise<Enrollment> {
    return prisma.enrollment.create({ data })
  },

  async delete(id: number): Promise<Enrollment> {
    return prisma.enrollment.delete({
      where: { enrollment_id: id }
    })
  },

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return prisma.enrollment.findMany({
      where: { user_id: userId },
      include: {
        course: true
      }
    })
  }
} 