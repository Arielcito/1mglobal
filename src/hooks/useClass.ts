import { useQuery } from 'react-query'

interface Class {
  class_id: number
  title: string
  description: string
  duration: number | null
  recording_url: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  is_live: boolean
  scheduled_at: string | null
  course_id: number
}

export const useClass = (courseId: string) => {
  return useQuery({
    queryKey: ['classes', courseId],
    queryFn: async () => {
      const response = await fetch(`/api/classes?courseId=${courseId}`)
      if (!response.ok) throw new Error('Error al cargar las clases')
      return response.json() as Promise<Class[]>
    }
  })
} 