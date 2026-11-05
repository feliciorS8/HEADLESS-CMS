"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { loginAction, signupAction } from "@/actions/auth";
import type { ActionState } from "@/lib/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormMode = "login" | "signup";

function SubmitButton({ mode }: { mode: FormMode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-10 gap-2 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Memproses autentikasi...</span>
        </>
      ) : mode === "login" ? (
        <>
          <LogIn className="size-4" />
          <span>Masuk ke Dashboard</span>
        </>
      ) : (
        <>
          <UserPlus className="size-4" />
          <span>Daftar Akun Baru</span>
        </>
      )}
    </Button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<FormMode>("login");

  const [loginState, runLoginAction] = useActionState<ActionState | null, FormData>(
    loginAction,
    null
  );

  const [signupState, runSignupAction] = useActionState<ActionState | null, FormData>(
    signupAction,
    null
  );

  const state = mode === "login" ? loginState : signupState;
  const currentAction = mode === "login" ? runLoginAction : runSignupAction;

  return (
    <div className="space-y-4">
      {/* Tab Switcher: Masuk vs Daftar */}
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-border/80 bg-muted/60 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex h-8 items-center justify-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
            mode === "login"
              ? "bg-card text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex h-8 items-center justify-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
            mode === "signup"
              ? "bg-card text-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Daftar Akun Baru
        </button>
      </div>

      <form action={currentAction} className="space-y-3.5">
        <input type="hidden" name="next" value={next} />

        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-medium">
              Nama Lengkap
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Contoh: Khadija"
              autoComplete="name"
              className="h-9 text-xs"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium">
            Alamat Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            required
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-medium flex items-center justify-between">
            <span>Password</span>
            <span className="text-[10px] text-muted-foreground">min. 6 karakter</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            className="h-9 text-xs"
          />
        </div>

        <SubmitButton mode={mode} />

        {state && !state.success && (
          <Alert variant="destructive" className="py-2.5">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-xs">{state.message}</AlertDescription>
          </Alert>
        )}

        {state?.success && (
          <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 py-2.5">
            <CheckCircle2 className="size-4" />
            <AlertDescription className="text-xs">{state.message}</AlertDescription>
          </Alert>
        )}
      </form>

      {/* Akses Cepat Langsung ke Dashboard */}
      <div className="pt-2">
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/70" />
          </div>
          <span className="relative bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Atau Akses Langsung
          </span>
        </div>

        <Link
          href={next && next.startsWith("/") ? next : "/tasks"}
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
        >
          <span>Lanjut ke Dashboard Tugas Tanpa Login</span>
          <ArrowRight className="size-3.5 text-primary" />
        </Link>
      </div>
    </div>
  );
}
