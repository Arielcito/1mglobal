'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { StreamPlayer, StreamSkeleton } from '@/components/StreamComponent/StreamPlayer'
import { useQuery } from '@tanstack/react-query'
import StreamingLayout from '../../layout'
import type { Stream } from '@/types/stream'
import api from '@/app/libs/axios'

const StreamContent = () => {
  const params = useParams()
  const { user } = useAuth()
  const streamId = params.streamId as string

  const { data: streamData, isLoading: streamLoading } = useQuery<Stream>({
    queryKey: ['stream', streamId],
    queryFn: async () => {
      const { data } = await api.get(`/api/stream/live/${streamId}`)
      return data
    },
    enabled: !!streamId,
    staleTime: 1000 * 60 * 5 // 5 minutos
  })

  const { data: tokenData, isLoading: tokenLoading } = useQuery({
    queryKey: ['stream-token', streamData?.name],
    queryFn: async () => {
      const { data } = await api.post('/api/stream/viewer-token', {
        room_name: streamData?.name
      })
      return {
        token: data.token,
        ws_url: data.ws_url
      }
    },
    enabled: !!streamData?.name
  })

  if (streamLoading || !streamData) {
    return <StreamSkeleton />
  }

  if (tokenLoading || !tokenData) {
    return <StreamSkeleton />
  }

  const isHost = streamData?.userId === user?.id
  const hostName = streamData.user?.name || 'Usuario Desconocido'
  const hostImage = streamData.user?.image || ''

  return (
    <StreamPlayer
      streamId={streamData.id}
      token={tokenData.token}
      hostName={hostName}
      hostImage={hostImage}
      title={streamData.title}
      description={streamData.description}
      viewerCount={0}
      isHost={isHost}
    />
  )
}

export default function StreamPage() {
  return (
    <StreamingLayout>
      <Suspense fallback={<StreamSkeleton />}>
        <StreamContent />
      </Suspense>
    </StreamingLayout>
  )
}
