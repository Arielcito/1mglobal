'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQuery } from 'react-query'
import { CoursesSkeleton } from './CoursesSkeleton'
import api from '@/app/libs/axios'

type Class = {
  id: number
  title: string
  description: string
  content: string
  duration: number
  order: number
  status: string
  recording_url: string | null
  is_live: boolean
  scheduled_at: string | null
}

type Course = {
  course_id: number
  title: string
  description: string
  image_url: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: {
    name: string
  }
  classes: Class[]
}

// Funciones para fetch de datos
const fetchCourses = async (): Promise<Course[]> => {
  try {
    const { data } = await api.get('/api/courses')
    return data
  } catch (error) {
    throw new Error('Error al cargar los cursos')
  }
}

const fetchClassesForCourse = async (courseId: number): Promise<Class[]> => {
  try {
    const { data } = await api.get(`/api/classes/course/${courseId}`)
    return data
  } catch (error) {
    throw new Error('Error al cargar las clases')
  }
}

export function CoursesGrid() {
  const router = useRouter()

  // Query para obtener los cursos
  const { 
    data: coursesData, 
    isLoading: isLoadingCourses 
  } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  })

  // Queries para obtener las clases de cada curso
  const { 
    data: coursesWithClasses,
    isLoading: isLoadingClasses
  } = useQuery({
    queryKey: ['coursesWithClasses', coursesData],
    queryFn: async () => {
      if (!coursesData) return []
      
      const coursesWithClassesData = await Promise.all(
        coursesData.map(async (course) => {
          const classes = await fetchClassesForCourse(course.course_id)
          return { ...course, classes }
        })
      )
      return coursesWithClassesData
    },
    enabled: !!coursesData // Solo se ejecuta cuando coursesData está disponible
  })

  const isLoading = isLoadingCourses || isLoadingClasses

  if (isLoading) {
    return <CoursesSkeleton />
  }

  const handleCourseClick = (courseId: number) => {
    router.push(`/courses/${courseId}`)
  }

  const handleKeyDown = (event: React.KeyboardEvent, courseId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCourseClick(courseId)
    }
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {coursesWithClasses?.map((course) => (
        <li 
          key={course.course_id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCourseClick(course.course_id)}
          onKeyDown={(e) => handleKeyDown(e, course.course_id)}
          tabIndex={0}
          aria-label={`Curso: ${course.title}`}
        >
          <Card>
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={course.image_url}
                  alt={course.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                {course.category && (
                  <Badge>{course.category.name}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{course.description}</p>
              <div className="mt-2">
                <Badge variant="outline" className="mr-2">
                  {course.level}
                </Badge>
                <Badge variant="secondary">
                  {course.classes.length} clases
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="flex gap-2">
                {course.classes.some(c => c.is_live) && (
                  <Badge variant="destructive">EN VIVO</Badge>
                )}
                {course.classes.some(c => c.scheduled_at) && (
                  <Badge variant="secondary">Próximas clases</Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  )
} 