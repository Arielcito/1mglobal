'use client'

import { Class, Resource } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ClassWithResources extends Class {
  resources: Resource[]
}

export function ClassViewer({ classData }: { classData: ClassWithResources }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {classData.title}
              </CardTitle>
              <p className="text-muted-foreground">
                {classData.description}
              </p>
            </div>
            <Badge>{classData.duration} minutos</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-4">
              <div className="prose dark:prose-invert max-w-none">
                {classData.content}
              </div>
            </TabsContent>
            <TabsContent value="resources" className="mt-4">
              <div className="space-y-4">
                {classData.resources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.type}
                        </p>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Descargar
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 