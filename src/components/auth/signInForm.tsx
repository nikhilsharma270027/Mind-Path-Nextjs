"use client";

import { useRouter } from "next/navigation";
import { email, z } from "zod";
import { toast } from "sonner"
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { Eye, EyeClosed } from "lucide-react";


const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


export default function SignInForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<{ [key: string]: string } | null>({});
    const [showPassword, setShowPassword] = React.useState(false);

    const validateForm = (email: string, password: string) => {
    try {
      signInSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.issues.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!validateForm(email, password)) {
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("SignIn response:", res);

      if (res?.error) {
        toast.error("Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      toast.success("Login successful!");
      setLoading(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };  

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
            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full text-black bg-white pr-10" // note the pr-10 to prevent text overlap
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </div>
            </div>
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