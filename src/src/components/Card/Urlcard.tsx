'use client'

import React from 'react'
import { Input } from '../ui/input'
import { CopyButton } from '../ui/copy-button'
import { Card, CardHeader, CardContent } from '../ui/card'

interface UrlcardProps {
  serverUrl: string
  isLoading: boolean
}

export default function Urlcard({ serverUrl, isLoading }: UrlcardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Server URL
          </p>
          <CopyButton value={serverUrl} />
        </div>
      </CardHeader>
      <CardContent>
        <Input 
          value={isLoading ? 'Cargando...' : serverUrl} 
          disabled 
          className="bg-muted/50 border-stroke-dark"
        />
      </CardContent>
    </Card>
  )
}
