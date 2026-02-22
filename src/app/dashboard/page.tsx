'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?auth=required')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard, {user.email}</p>
      {/* Add dashboard content here */}
    </div>
  )
}