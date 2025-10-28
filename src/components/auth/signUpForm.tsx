'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<z.infer<typeof signupSchema>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const validateForm = (name: string, email: string, password: string) => {
    try {
      signupSchema.parse({ name, email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<z.infer<typeof signupSchema>> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof z.infer<typeof signupSchema>] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate single field
    try {
      if (field === 'name') {
        signupSchema.shape.name.parse(value);
        setErrors({ ...errors, name: undefined });
      } else if (field === 'email') {
        signupSchema.shape.email.parse(value);
        setErrors({ ...errors, email: undefined });
      } else if (field === 'password') {
        signupSchema.shape.password.parse(value);
        setErrors({ ...errors, password: undefined });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({ ...errors, [field]: error.issues[0].message });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!validateForm(username, email, password)) {
      setLoading(false);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, email, password }),
      });

      if (res.status === 409) {
        toast.error("User already exists", {
          description: "Please try signing in instead"
        });
      } else if (res.ok) {
        toast.success("Registration successful!", {
          description: "Redirecting to sign in..."
        });
        setTimeout(() => router.push("/signin"), 1000);
      } else {
        toast.error("Something went wrong", {
          description: "Please try again later"
        });
      }
    } catch (error: any) {
      toast.error("Signup failed", {
        description: error.message || "Please check your connection"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Username field */}
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <User className="w-5 h-5" />
          </div>
          <Input
            id="username"
            type="text"
            name="username"
            placeholder="John Doe"
            required
            onBlur={(e) => handleBlur('name', e.target.value)}
            className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
            aria-invalid={touched.name && !!errors?.name}
          />
        </div>
        {touched.name && errors?.name && (
          <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1 animate-in slide-in-from-top-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="john@example.com"
            required
            onBlur={(e) => handleBlur('email', e.target.value)}
            className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
            aria-invalid={touched.email && !!errors?.email}
          />
        </div>
        {touched.email && errors?.email && (
          <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1 animate-in slide-in-from-top-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            required
            onBlur={(e) => handleBlur('password', e.target.value)}
            className="pl-10 pr-10 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
            aria-invalid={touched.password && !!errors?.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {touched.password && errors?.password && (
          <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1 animate-in slide-in-from-top-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
            {errors.password}
          </p>
        )}
        {!errors?.password && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Must contain 6+ characters with uppercase, lowercase, and number
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button 
        type="submit" 
        className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}