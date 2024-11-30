import { prisma } from "@/lib/prisma"
import { Course, Prisma } from "@prisma/client"

export const CourseModel = {
  async getById(id: number): Promise<Course | null> {
    return prisma.course.findUnique({
      where: { course_id: id }
    })
  },

  async getAll(): Promise<Course[]> {
    return prisma.course.findMany({
      include: {
        instructor: true,
      }
    })
  },

  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    return prisma.course.create({ data })
  },

  async update(id: number, data: Prisma.CourseUpdateInput): Promise<Course> {
    return prisma.course.update({
      where: { course_id: id },
      data
    })
  },

  async delete(id: number): Promise<Course> {
    return prisma.course.delete({
      where: { course_id: id }
    })
  }
} 