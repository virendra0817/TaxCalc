"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Chrome, Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  const handleSignIn = async (provider: "google" | "github") => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background px-4">
      {/* Card */}
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="font-space text-2xl tracking-tight">TaxPilot</span>
          </Link>
          <p className="text-muted-foreground text-sm">Sign in to save your calculations</p>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-3">
          <Button
            className="w-full h-11 gap-3 text-sm"
            variant="outline"
            onClick={() => handleSignIn("google")}
            disabled={loading !== null}
          >
            {loading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <Button
            className="w-full h-11 gap-3 text-sm"
            variant="outline"
            onClick={() => handleSignIn("github")}
            disabled={loading !== null}
          >
            {loading === "github" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            Continue with GitHub
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">or</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            All 16 calculators are free without an account.{" "}
            <Link href="/" className="text-primary underline underline-offset-2 hover:no-underline">
              Skip sign in →
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our terms. We never share your data.
        </p>
      </div>
    </div>
  );
}
