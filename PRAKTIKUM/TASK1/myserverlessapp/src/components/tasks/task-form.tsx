"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2, PlusCircle, Sparkles } from "lucide-react";
import { createTaskAction } from "@/actions/tasks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Tombol submit terpisah yang memanfaatkan hook useFormStatus() dari React DOM
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-10 w-full gap-2 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span>Menyimpan tugas...</span>
        </>
      ) : (
        <>
          <PlusCircle className="size-4" aria-hidden="true" />
          <span>Simpan Tugas</span>
        </>
      )}
    </Button>
  );
}

export function TaskForm() {
  const [state, formAction] = useActionState(createTaskAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Bersihkan form secara otomatis saat tugas berhasil dibuat
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card className="relative overflow-hidden border-border/80 bg-card shadow-lg shadow-primary/5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
      <CardHeader className="gap-3 p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-2.5">
              <Sparkles className="size-3" aria-hidden="true" />
              Tugas Baru
            </Badge>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <PlusCircle className="size-4 text-primary" aria-hidden="true" />
              Tambah Tugas
            </CardTitle>
            <p className="text-sm leading-5 text-muted-foreground">
              Rencanakan dan pantau perkembangan tugas Anda.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <Separator className="mb-5" />
        <form ref={formRef} action={formAction} className="space-y-4">
          {/* Input Judul Tugas */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Judul Tugas <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Contoh: Implementasi RBAC Supabase"
              minLength={3}
              maxLength={100}
              required
              aria-invalid={Boolean(state?.errors?.title)}
              aria-describedby={state?.errors?.title ? "title-error" : undefined}
              className={state?.errors?.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state?.errors?.title && (
              <p
                id="title-error"
                className="flex items-center gap-1 text-xs font-medium text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{state.errors.title[0]}</span>
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Minimal 3 dan maksimal 100 karakter.
            </p>
          </div>

          {/* Pilihan Prioritas */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Prioritas
            </Label>
            <select
              id="priority"
              name="priority"
              defaultValue="medium"
              aria-invalid={Boolean(state?.errors?.priority)}
              aria-describedby={state?.errors?.priority ? "priority-error" : undefined}
              className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 ${
                state?.errors?.priority ? "border-destructive" : ""
              }`}
            >
              <option value="low">Rendah (Low)</option>
              <option value="medium">Sedang (Medium)</option>
              <option value="high">Tinggi (High)</option>
            </select>
            {state?.errors?.priority && (
              <p
                id="priority-error"
                className="flex items-center gap-1 text-xs font-medium text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{state.errors.priority[0]}</span>
              </p>
            )}
          </div>

          {/* Tombol Submit dengan useFormStatus */}
          <SubmitButton />

          {/* Feedback Hasil Aksi */}
          {state && (
            <Alert
              variant={state.success ? "default" : "destructive"}
              role={state.success ? "status" : "alert"}
              className={state.success ? "border-primary/20 bg-primary/5 mt-3" : "mt-3"}
            >
              {state.success ? (
                <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              ) : (
                <AlertCircle className="size-4" aria-hidden="true" />
              )}
              <AlertTitle className="text-xs font-semibold">
                {state.success ? "Berhasil" : "Perhatian"}
              </AlertTitle>
              <AlertDescription className="text-xs">{state.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// Alias untuk kompatibilitas
export const CreateTaskForm = TaskForm;

