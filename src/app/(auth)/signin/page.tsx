'use client';

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import SignUpForm from "@/components/auth/signUpForm"
import SignInForm from "@/components/auth/signInForm";

export default function RegisterPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/home')
    }
  }, [session, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 sm:py-12  px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mb-6 sm:mb-8">
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold tracking-tight text-purple-300">
          Welcome to Mind Path
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-white">
          Let's get started with your study journey
        </p>
      </div>
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md px-4 sm:px-10 py-6 sm:py-8 shadow-lg rounded-lg sm:rounded-xl border-2 border-white/20">
          <h1 className="text-sm sm:text-lg font-bold text-center mb-4 sm:mb-6 text-gray-900">
            Create your account
          </h1>
          <SignInForm />
          <p className="mt-4 text-center text-xs sm:text-sm text-white">
            Already have an account?{' '}
            <Link href="/register" className="text-[#7fb236] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}