"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, PlusCircle, Sparkles } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState(createTaskAction, null);

  return (
    <Card className="relative overflow-hidden border-border/80 bg-card shadow-lg shadow-primary/5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
      <CardHeader className="gap-3 p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-2.5">
              <Sparkles className="size-3" aria-hidden="true" />
              Mutasi tugas
            </Badge>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <PlusCircle className="size-4 text-primary" aria-hidden="true" />
              Buat tugas baru
            </CardTitle>
            <p className="text-sm leading-5 text-muted-foreground">
              Catat modul berikutnya dalam perjalananmu.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <Separator className="mb-5" />
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Judul Tugas
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Contoh: Implementasi RLS Supabase"
              minLength={3}
              maxLength={100}
              required
              disabled={isPending}
              aria-invalid={Boolean(state?.errors?.title)}
              aria-describedby={
                state?.errors?.title ? "title-error" : undefined
              }
              className={
                state?.errors?.title
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {state?.errors?.title && (
              <p
                id="title-error"
                className="flex items-center gap-1 text-xs font-medium text-destructive"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{state.errors.title[0]}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Gunakan 3–100 karakter agar judul mudah dikenali.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Deskripsi{" "}
              <span className="font-normal text-muted-foreground">
                (opsional)
              </span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tuliskan tujuan atau detail tugas..."
              rows={4}
              disabled={isPending}
              aria-invalid={Boolean(state?.errors?.description)}
              aria-describedby={
                state?.errors?.description ? "description-error" : undefined
              }
            />
            {state?.errors?.description && (
              <p
                id="description-error"
                className="flex items-center gap-1 text-xs font-medium text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{state.errors.description[0]}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Prioritas
            </Label>
            <select
              id="priority"
              name="priority"
              defaultValue="medium"
              disabled={isPending}
              aria-invalid={Boolean(state?.errors?.priority)}
              aria-describedby={
                state?.errors?.priority ? "priority-error" : undefined
              }
              className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 ${
                state?.errors?.priority ? "border-destructive" : ""
              }`}
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
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

          <Button
            type="submit"
            disabled={isPending}
            className="h-10 w-full gap-2 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {isPending ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Memproses...
              </>
            ) : (
              <>
                <PlusCircle className="size-4" aria-hidden="true" />
                Simpan Tugas
              </>
            )}
          </Button>

          {state && (
            <Alert
              variant={state.success ? "default" : "destructive"}
              role={state.success ? "status" : "alert"}
              className={
                state.success
                  ? "border-primary/20 bg-primary/5"
                  : undefined
              }
            >
              {state.success ? (
                <CheckCircle2 aria-hidden="true" />
              ) : (
                <AlertCircle aria-hidden="true" />
              )}
              <AlertTitle>
                {state.success ? "Validasi berhasil" : "Perlu diperiksa"}
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
