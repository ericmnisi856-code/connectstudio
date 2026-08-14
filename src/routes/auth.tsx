import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { grantAdminIfSuperUser } from "@/lib/auto-admin.functions";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Staff Sign In | Studio Connect" },
      {
        name: "description",
        content: "Sign in to the Studio Connect admin area to manage Reyee hardware orders.",
      },
      { property: "og:title", content: "Staff Sign In | Studio Connect" },
      { property: "og:description", content: "Sign in to manage Studio Connect orders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safePath(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const destination = safePath(search.redirect);
  const grantAdmin = useServerFn(grantAdminIfSuperUser);

  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        // Try to grant admin for super users
        try {
          await grantAdmin();
        } catch (e) {
          console.log('Admin grant attempt:', e);
        }
        
        toast.success("Account created. You're signed in.");
        await navigate({ to: destination });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Try to grant admin for super users on signin too
        try {
          await grantAdmin();
        } catch (e) {
          console.log('Admin grant attempt:', e);
        }
        
        await navigate({ to: destination });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-border/70 bg-card p-8">
        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-gradient">
          <Lock className="size-5 text-primary-foreground" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Staff sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access the Studio Connect order dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-gradient text-primary-foreground hover:opacity-90"
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>




        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "signin"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
