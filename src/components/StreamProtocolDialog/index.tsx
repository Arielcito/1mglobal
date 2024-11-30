'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface StreamProtocolDialogProps {
  streamId: number
}

export function StreamProtocolDialog({ streamId }: StreamProtocolDialogProps) {
  const [protocol, setProtocol] = React.useState<string>('')
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleContinue = () => {
    if (!protocol) return
    router.push(`/stream/${streamId}?protocol=${protocol}`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className="bg-card text-card-foreground rounded-lg shadow-sm p-4 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
          onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
        >
          <div className="aspect-video bg-muted rounded-md mb-2" />
          <h3 className="font-medium">
            Transmisión en vivo {streamId}
          </h3>
          <p className="text-sm text-muted-foreground">
            En curso
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleccionar Protocolo de Streaming</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={protocol} onValueChange={setProtocol}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar protocolo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whip">WHIP</SelectItem>
              <SelectItem value="rtmp">RTMP</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleContinue} disabled={!protocol}>
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
