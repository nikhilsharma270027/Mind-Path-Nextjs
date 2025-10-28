'use client';

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import SignUpForm from "@/components/auth/signUpForm"
import { Sparkles, GraduationCap } from "lucide-react"

export default function RegisterPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/home')
    }
  }, [session, router])

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 animate-float">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-white/90 font-medium">Start Your Learning Journey</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400">
                Mind Path
              </span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Your personalized AI-powered study companion. Track progress, take notes, and achieve your academic goals with intelligent insights.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center border border-white/10">
                <GraduationCap className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Smart Study Plans</h3>
                <p className="text-white/70 text-sm">AI-generated personalized study schedules</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Interactive Learning</h3>
                <p className="text-white/70 text-sm">Chat with your PDFs and notes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-white/90 font-medium">Start Your Journey</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Welcome to <span className="text-purple-300">Mind Path</span>
            </h2>
            <p className="text-white/80 text-sm">
              Your AI-powered study companion
            </p>
          </div>

          {/* Form card */}
          <div className="relative">
            {/* Gradient glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-75"></div>
            
            <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Decorative gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500"></div>
              
              <div className="p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Create Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Join thousands of students learning smarter
                  </p>
                </div>

                <SignUpForm />

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link 
                      href="/signin" 
                      className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/60">
              🔒 Secure • 🚀 Fast • 🎯 Personalized
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}