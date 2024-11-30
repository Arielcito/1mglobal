import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const CoursesSkeleton = () => {
  // Mostrar 4 skeleton cards
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {[1, 2, 3, 4].map((index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="p-0">
            {/* Skeleton para la imagen */}
            <Skeleton className="aspect-video w-full" />
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              {/* Skeleton para el título */}
              <Skeleton className="h-7 w-[200px]" />
              {/* Skeleton para la categoría */}
              <Skeleton className="h-5 w-[80px]" />
            </div>
            
            {/* Skeleton para la descripción */}
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
            
            {/* Skeleton para los badges */}
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[80px]" />
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-[120px]" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 