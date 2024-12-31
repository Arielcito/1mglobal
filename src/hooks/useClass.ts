import { useQuery } from 'react-query'
import api from '@/app/libs/axios'
import type { Class } from '@/types/class'

export const useClass = (courseId: string) => {
  return useQuery({
    queryKey: ['classes', courseId],
    queryFn: async () => {
      const response = await api.get(`/api/classes/course/${courseId}`)
      if (!response.data) throw new Error('Error al cargar las clases')
      return response.data as Promise<Class[]>
    }
  })
} 