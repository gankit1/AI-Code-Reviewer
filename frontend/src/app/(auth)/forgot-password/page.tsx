"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (_data: ForgotForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSent(true);
    toast.success("Reset link sent to your email");
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="w-full h-11">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-muted-foreground">
          Enter your email to receive a password reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full h-11 animated-gradient text-white border-0"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline font-medium">
          <ArrowLeft className="inline h-3 w-3 mr-1" />
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
