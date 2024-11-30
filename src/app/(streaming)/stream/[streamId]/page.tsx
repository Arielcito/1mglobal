'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { StreamPlayer, StreamSkeleton } from '@/components/StreamComponent/StreamPlayer'
import { useQuery } from 'react-query'
import StreamingLayout from '../../layout'

export default function StreamPage() {
  const params = useParams()
  const { data: session } = useSession()
  const streamId = params.streamId as string

  const { data: streamData, isLoading: streamLoading } = useQuery(
    ['stream', streamId],
    async () => {
      const res = await fetch(`/api/streams/${streamId}`)
      if (!res.ok) throw new Error('Failed to fetch stream')
      const data = await res.json()
      console.log('🔄 Stream data', data)
      return data
    },
    {
      enabled: !!streamId,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  )

  const { data: tokenData, isLoading: tokenLoading } = useQuery(
    ['stream-token', streamData?.name],
    async () => {
      console.log('🎯 Fetching token for room:', streamData?.name)
      const res = await fetch(`/api/livekit/token?room=${streamData?.name}`)
      if (!res.ok) throw new Error('Failed to fetch token')
      const data = await res.json()
      console.log('🎯 Token received:', data)
      return data
    },
    {
      enabled: !!streamData?.name,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  )

  if (streamLoading || !streamData) {
    return <StreamSkeleton />
  }

  if (tokenLoading || !tokenData) {
    console.log('🔄 Waiting for token...', {
      tokenLoading,
      tokenData,
      roomName: streamData?.name
    })
    return <StreamSkeleton />
  }

  const isHost = streamData.userId === session?.user?.id

  return (
    <StreamingLayout>
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
    </StreamingLayout>
  )
}
