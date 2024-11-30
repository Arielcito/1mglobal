import { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CreateUserData = {
  email: string;
  username: string;
  password?: string;
  name?: string;
  full_name?: string;
  image?: string;
};

export type UpdateUserData = Partial<CreateUserData>;

export const userService = {
  // Obtener usuario por ID
  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          courses: true,
          enrollments: true,
          memberships: true,
          stream: true,
        },
      });

      return user;
    } catch (error) {
      console.error("[GET_USER_BY_ID]", error);
      throw error;
    }
  },

  // Obtener usuario por email
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      console.error("[GET_USER_BY_EMAIL]", error);
      throw error;
    }
  },

  // Obtener usuario por username
  async getUserByUsername(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      return user;
    } catch (error) {
      console.error("[GET_USER_BY_USERNAME]", error);
      throw error;
    }
  },

  // Crear nuevo usuario
  async createUser(data: CreateUserData) {
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
          username: data.username.toLowerCase(),
          email: data.email.toLowerCase(),
        },
      });

      return user;
    } catch (error) {
      console.error("[CREATE_USER]", error);
      throw error;
    }
  },

  // Actualizar usuario
  async updateUser(userId: string, data: UpdateUserData) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data,
      });

      return user;
    } catch (error) {
      console.error("[UPDATE_USER]", error);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUser(userId: string) {
    try {
      const user = await prisma.user.delete({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      console.error("[DELETE_USER]", error);
      throw error;
    }
  },

  // Obtener todos los cursos de un usuario
  async getUserCourses(userId: string) {
    try {
      const courses = await prisma.course.findMany({
        where: { instructor_id: userId },
        include: {
          classes: true,
          enrollments: true,
        },
      });

      return courses;
    } catch (error) {
      console.error("[GET_USER_COURSES]", error);
      throw error;
    }
  },

  // Obtener todas las inscripciones de un usuario
  async getUserEnrollments(userId: string) {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { user_id: userId },
        include: {
          course: true,
        },
      });

      return enrollments;
    } catch (error) {
      console.error("[GET_USER_ENROLLMENTS]", error);
      throw error;
    }
  },

  // Obtener membresía activa del usuario
  async getActiveMembership(userId: string) {
    try {
      const membership = await prisma.membership.findFirst({
        where: {
          user_id: userId,
          is_active: true,
          end_date: {
            gte: new Date(),
          },
        },
      });

      return membership;
    } catch (error) {
      console.error("[GET_ACTIVE_MEMBERSHIP]", error);
      throw error;
    }
  },

  // Obtener stream del usuario
  async getUserStream(userId: string) {
    try {
      const stream = await prisma.stream.findUnique({
        where: { userId },
      });

      return stream;
    } catch (error) {
      console.error("[GET_USER_STREAM]", error);
      throw error;
    }
  },
};
