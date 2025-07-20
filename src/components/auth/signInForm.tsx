"use client";

import { useRouter } from "next/navigation";
import { email, z } from "zod";
import { toast } from "sonner"
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
,
});


export default function SignInForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<{ [key: string]: string } | null>({});

    const validateForm = (email: string, password: string) => {
    try {
      signInSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  }  

    return (
        <form onSubmit={handleSubmit} className="space-x-4">
            
            <div className="mb-3">
                <Input 
                  type="email" 
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full text-black bg-white" />
                  {
                    errors?.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )
                  }
            </div>
            <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              className={`w-full text-black bg-white ${errors!.password ? 'border-red-500' : ''}`}
            />
            {errors!.password && (
              <p className="text-sm text-red-500 mt-1">{errors!.password}</p>
            )}
            {/* <p className="text-xs text-gray-50 mt-1 mb-3">
              Password must be at least 8 characters and contain uppercase, lowercase, and numbers
            </p> */}
          </div>
          <Button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </Button>
        </form>
    )

}