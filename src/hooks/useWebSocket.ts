// spura-gui/src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react'
import { api } from "@/config/api"

export function useWebSocket(taskId: string | null) {
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socket = useRef<WebSocket | null>(null)
  
  useEffect(() => {
    if (!taskId) return
    
    const ws = new WebSocket(`${api.wsBaseUrl}/ws/tasks/${taskId}`)
    
    ws.onopen = () => {
      setIsConnected(true)
      console.log('WebSocket connected')
    }
    
    ws.onmessage = (event) => {
      setLastMessage(event.data)
    }
    
    ws.onclose = () => {
      setIsConnected(false)
      console.log('WebSocket disconnected')
    }
    
    socket.current = ws
    
    return () => {
      if (socket.current) {
        socket.current.close()
      }
    }
  }, [taskId])
  
  return { lastMessage, isConnected }
}