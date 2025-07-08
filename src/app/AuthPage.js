'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // App Router
// import { useRouter } from 'next/router' // Pages Router - DON'T USE THIS

export function useAuth(redirectTo = '/') {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('userData')
    
    if (!token && !user) {
      router.push(redirectTo)
    } else {
      setIsLoading(false)
    }
  }, [redirectTo, router])
  
  return { isLoading  }
}