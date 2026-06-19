"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (token && refreshToken) {
      // Store tokens temporarily to fetch user
      useAuthStore.setState({ accessToken: token });

      api.auth
        .getMe()
        .then((response) => {
          const user = response.data.data.user;
          setAuth(user, token, refreshToken);
          toast.success("Successfully signed in with GitHub!");
          router.push("/dashboard");
        })
        .catch(() => {
          toast.error("Authentication failed");
          router.push("/login");
        });
    } else {
      toast.error("Invalid callback parameters");
      router.push("/login");
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Completing authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
