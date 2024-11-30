import { z } from 'zod'

export const CourseLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED'
} as const

export type CourseLevel = typeof CourseLevel[keyof typeof CourseLevel]

export interface Course {
  course_id: number
  title: string
  description: string
  price: number
  level: CourseLevel
  category: string
  thumbnail_url?: string
  is_published: boolean
  instructor_id: string
  created_at: Date
  updated_at: Date
}

export type CreateCourseInput = {
  title: string
  description: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category_id: number | null
  is_published: boolean
  thumbnail_url?: string
}
