'use client'

import Urlcard from "@/components/Card/Urlcard";
import Streamcard from "@/components/Card/Streamcard";
import { STREAM_KEYS } from "@/lib/constants";
import { useQuery } from "react-query";
import { useUser } from "@/hooks/useUser";

const fetchStreamData = async (userId: string) => {
  const response = await fetch(`/api/stream/${userId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()
  return {
    serverUrl: data.serverUrl,
    streamKey: data.streamKey
  }
}

export default function KeysPage() {
  const user = useUser()
  
  const { data: streamData, isLoading, refetch } = useQuery(
    STREAM_KEYS.serverUrl(user?.id ?? ''),
    () => fetchStreamData(user?.id ?? ''),
    {
      enabled: !!user?.id, // Only run query if we have a user ID
      refetchOnWindowFocus: false,
    }
  )

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Keys & URLs</h1>
      </div>
      <Urlcard 
        serverUrl={streamData?.serverUrl ?? 'No disponible'} 
        isLoading={isLoading} 
      />
      <Streamcard 
        streamKey={streamData?.streamKey ?? 'No disponible'} 
        isLoading={isLoading} 
      />
    </div>
  )
}
