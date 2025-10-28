'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { signupSchema } from "@/schemas/signupSchema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
,
});

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<z.infer<typeof signupSchema>>>({});
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!validateForm(username, email, password)) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });
      console.log("Signup response:", res);

      if (res.status === 409) {
        toast.error("User already exists");
      } else if (res.ok) {
        toast.success("Registration successful");
      } else {
        toast.error("Something went wrong");
      }
      const data = await res.json();

      

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Signup successful!");
      router.push("/signin");
    } catch (error: any) {
      toast.error(error.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="username"
        placeholder="Username"
        required
        className="w-full text-black bg-white"
      />
      {errors?.name && (
        <p className="text-red-500 text-sm">{errors.name}</p>
      )}

      <Input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full text-black bg-white"
      />
      {errors?.email && (
        <p className="text-red-500 text-sm">{errors.email}</p>
      )}

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

      {errors?.password && (
        <p className="text-red-500 text-sm">{errors.password}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up..." : "Signup"}
      </Button>
    </form>
  );
}
