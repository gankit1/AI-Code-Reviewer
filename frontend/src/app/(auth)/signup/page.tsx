"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Loader2, Eye, EyeOff } from "lucide-react";
import { Github } from "@/components/icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api-client";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const response = await api.auth.register(data);
      const { user, accessToken, refreshToken } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message || "Registration failed";
      toast.error(message);
    }
  };

  const handleGitHubSignup = async () => {
    setIsGitHubLoading(true);
    try {
      const response = await api.auth.getGitHubUrl();
      window.location.href = response.data.data.url;
    } catch {
      toast.error("Failed to connect to GitHub");
      setIsGitHubLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg animated-gradient flex items-center justify-center">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            CodeLens <span className="gradient-text">AI</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">
          Get started with AI-powered code reviews
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full h-11"
        onClick={handleGitHubSignup}
        disabled={isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        Continue with GitHub
      </Button>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          or
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            {...register("name")}
            className="h-11"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            {...register("email")}
            className="h-11"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              {...register("password")}
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 animated-gradient text-white border-0"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
