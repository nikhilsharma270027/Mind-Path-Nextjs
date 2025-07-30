'use client'

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  // Update form data when session changes
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      })
    }
  }, [session])

  console.log(session)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/25">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
        
        <CardHeader className="relative border-b border-white/20 bg-white/5 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-white/30 shadow-xl">
                <AvatarImage
                  src={session?.user?.image || "/images/default-avatar.png"}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="bg-white/20 text-white font-semibold text-xl">
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white/50 shadow-lg" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl drop-shadow-sm">{session?.user?.name || session?.user?.username}</h1>
              <p className="text-sm text-white/70 drop-shadow-sm">{session?.user?.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative p-6 text-white">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 drop-shadow-sm">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 transition-all duration-200 shadow-lg"
                  name="name"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 drop-shadow-sm">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 placeholder:text-white/30 cursor-not-allowed shadow-lg"
                  name="email"
                  disabled
                  placeholder="Email cannot be changed"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-transparent hover:bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 uppercase tracking-wide">Name</label>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-md p-3 shadow-inner">
                    <p className="text-white font-medium">{session?.user?.name || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 uppercase tracking-wide">Email</label>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-md p-3 shadow-inner">
                    <p className="text-white font-medium">{session?.user?.email || 'Not set'}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  // Ensure form data is up to date when entering edit mode
                  if (session?.user) {
                    setFormData({
                      name: session.user.name || '',
                      email: session.user.email || '',
                    })
                  }
                  setIsEditing(true)
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}