'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { StreamPlayer, StreamSkeleton } from '@/components/StreamComponent/StreamPlayer'
import { useQuery } from 'react-query'
import StreamingLayout from '../../layout'
import type { Stream } from '@/types/stream'
import api from '@/app/libs/axios'

const StreamContent = () => {
  const params = useParams()
  const { user } = useAuth()
  const streamId = params.streamId as string

  const { data: streamData, isLoading: streamLoading } = useQuery<Stream>(
    ['stream', streamId],
    async () => {
      const { data } = await api.get(`/api/stream/live/${streamId}`)
      console.log('🔄 Stream data', data)
      return data
    },
    {
      enabled: !!streamId,
      staleTime: 1000 * 60 * 5 // 5 minutos
    }
  )

  const { data: tokenData, isLoading: tokenLoading } = useQuery(
    ['stream-token', streamData?.name],
    async () => {
      console.log('🎯 Solicitando token para sala:', streamData?.name)
      const { data } = await api.post('/api/stream/viewer-token', {
        room_name: streamData?.name
      })
      console.log('🎯 Token recibido:', data)
      return {
        token: data.token,
        ws_url: data.ws_url
      }
    },
    {
      enabled: !!streamData?.name,
      staleTime: 1000 * 60 * 5 // 5 minutos
    }
  )

  if (streamLoading || !streamData) {
    return <StreamSkeleton />
  }

  if (tokenLoading || !tokenData) {
    console.log('🔄 Esperando token...', {
      tokenLoading,
      tokenData,
      roomName: streamData?.name
    })
    return <StreamSkeleton />
  }

  const isHost = streamData?.userId === user?.id

  return (
    <StreamPlayer
      streamId={streamData.id}
      token={tokenData.token}
      hostName={streamData.user.name}
      hostImage={streamData.user.image}
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
