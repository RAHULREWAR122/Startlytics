'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth(redirectTo = '/') {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = JSON.parse(localStorage.getItem('userData'))
    
    if (!token && !user) {
      router.push(redirectTo)
    } else {
      setIsLoading(false)
    }
  }, [redirectTo, router])
  
  return { isLoading  }
}