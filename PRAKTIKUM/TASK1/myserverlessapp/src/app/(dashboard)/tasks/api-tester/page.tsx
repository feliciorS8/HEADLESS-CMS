"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Code2,
  Copy,
  FlaskConical,
  KeyRound,
  Play,
  RotateCcw,
  Send,
  Smartphone,
  Sparkles,
  Terminal,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const DEFAULT_BODIES: Record<HttpMethod, string> = {
  GET: "",
  POST: JSON.stringify(
    {
      title: "Integrasi REST API Klien Mobile",
      priority: "high",
      status: "pending",
    },
    null,
    2
  ),
  PUT: JSON.stringify(
    {
      title: "Tugas Diperbarui via Mobile Client",
      status: "completed",
      priority: "medium",
    },
    null,
    2
  ),
  DELETE: "",
};

export default function ApiTesterPage() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("/api/v1/tasks");
  const [token, setToken] = useState("");
  const [body, setBody] = useState(DEFAULT_BODIES.GET);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [copied, setCopied] = useState(false);

  // Response Inspection State
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState("");
  const [responseData, setResponseData] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Helper cerdas mengambil token aktif dari sesi browser pengguna
  async function handleUseMySessionToken() {
    setIsFetchingToken(true);
    setErrorNotice(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setErrorNotice(`Gagal mengambil sesi: ${error.message}`);
        return;
      }

      const accessToken = data.session?.access_token;
      if (accessToken) {
        setToken(accessToken);
      } else {
        setErrorNotice(
          "Sesi login tidak ditemukan di browser ini. Silakan login terlebih dahulu melalui /login untuk mendapatkan token."
        );
      }
    } catch (err) {
      setErrorNotice(
        err instanceof Error ? err.message : "Gagal menginisialisasi client Supabase"
      );
    } finally {
      setIsFetchingToken(false);
    }
  }

  function handleMethodChange(newMethod: HttpMethod) {
    setMethod(newMethod);
    setBody(DEFAULT_BODIES[newMethod]);
    if (newMethod === "PUT" || newMethod === "DELETE") {
      if (url === "/api/v1/tasks") {
        setUrl("/api/v1/tasks/<id_tugas>");
      }
    } else {
      if (url.includes("<id_tugas>")) {
        setUrl("/api/v1/tasks");
      }
    }
  }

  async function handleSendRequest() {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    setLatencyMs(null);
    setErrorNotice(null);

    const startTime = performance.now();

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (token.trim()) {
        headers["Authorization"] = `Bearer ${token.trim()}`;
      }

      if (method === "POST" || method === "PUT") {
        headers["Content-Type"] = "application/json";
      }

      const requestOptions: RequestInit = {
        method,
        headers,
      };

      if ((method === "POST" || method === "PUT") && body.trim()) {
        requestOptions.body = body.trim();
      }

      const res = await fetch(url, requestOptions);
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText);

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResponseData(JSON.stringify(json, null, 2));
      } catch {
        setResponseData(text);
      }
    } catch (err) {
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      setErrorNotice(
        err instanceof Error
          ? `Gagal mengirim request: ${err.message}`
          : "Network request failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopyResponse() {
    if (!responseData) return;
    navigator.clipboard.writeText(responseData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const getMethodBadgeClass = (m: HttpMethod) => {
    switch (m) {
      case "GET":
        return "bg-sky-500/10 text-sky-600 border-sky-500/30 dark:text-sky-400";
      case "POST":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400";
      case "PUT":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400";
      case "DELETE":
        return "bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400";
    }
  };

  const getStatusBadgeVariant = (status: number) => {
    if (status >= 200 && status < 300) {
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (status >= 400 && status < 500) {
      return "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400";
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            Kembali ke Dashboard Web
          </Link>
          <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-primary">
            <Smartphone className="size-3" />
            Tahap 2: Universal REST API
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Code2 className="size-3.5" />
          <span>IETF RFC 7807 • CORS Enabled • Stateless JWT</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
          <FlaskConical className="size-7 text-primary" />
          Mobile REST Sandbox & API Tester
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Simulator pengujian endpoint serverless <code className="font-mono text-foreground font-semibold">/api/v1/tasks</code> untuk klien mobile (Flutter, React Native) dengan pengamanan stateless Bearer Token JWT dan kepatuhan Row Level Security (RLS).
        </p>
      </div>

      {/* Main Grid: Request Builder vs Response Inspector */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Request Builder Panel (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-border/80 bg-card shadow-lg shadow-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Terminal className="size-4 text-primary" />
                Request Configuration
              </CardTitle>
              <CardDescription>
                Tentukan method HTTP, path endpoint, dan konfigurasi otorisasi stateless.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* HTTP Method Selector Tabs */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  HTTP Method
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {(["GET", "POST", "PUT", "DELETE"] as HttpMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMethodChange(m)}
                      className={`flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        method === m
                          ? `${getMethodBadgeClass(m)} ring-2 ring-primary/20 shadow-xs scale-[1.02]`
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Endpoint URL Input */}
              <div className="space-y-2">
                <Label htmlFor="endpoint-url" className="text-xs font-medium">
                  Endpoint Path
                </Label>
                <div className="flex gap-2">
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-mono font-bold ${getMethodBadgeClass(method)}`}>
                    {method}
                  </span>
                  <Input
                    id="endpoint-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="/api/v1/tasks"
                    className="font-mono text-xs"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-muted-foreground">
                  <span>Preset Cepat:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("GET");
                      setUrl("/api/v1/tasks?page=1&limit=5");
                    }}
                    className="underline hover:text-foreground cursor-pointer"
                  >
                    GET Page 1 Limit 5
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("GET");
                      setUrl("/api/v1/tasks?search=Tugas");
                    }}
                    className="underline hover:text-foreground cursor-pointer"
                  >
                    GET Cari Judul
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("POST");
                      setUrl("/api/v1/tasks");
                      setBody(DEFAULT_BODIES.POST);
                    }}
                    className="underline hover:text-foreground cursor-pointer"
                  >
                    POST Tugas Baru
                  </button>
                </div>
              </div>

              {/* Bearer Token Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bearer-token" className="text-xs font-medium flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-primary" />
                    Bearer Token (Authorization Header)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleUseMySessionToken}
                    disabled={isFetchingToken}
                    className="h-6 gap-1 text-[11px] font-medium text-primary hover:text-primary cursor-pointer"
                  >
                    <Sparkles className="size-3" />
                    <span>{isFetchingToken ? "Mengambil..." : "Gunakan Token Sesi Saya"}</span>
                  </Button>
                </div>
                <Input
                  id="bearer-token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste JWT access_token Anda di sini..."
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Header yang dikirim: <code className="font-mono text-foreground font-semibold">Authorization: Bearer &lt;token&gt;</code>.
                  Wajib menyertakan token aktif agar Supabase RLS mengidentifikasi identitas pengguna Anda.
                </p>
              </div>

              {/* Request Body (untuk POST & PUT) */}
              {(method === "POST" || method === "PUT") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="request-body" className="text-xs font-medium">
                      JSON Request Body
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setBody(DEFAULT_BODIES[method])}
                      className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      Reset Format
                    </Button>
                  </div>
                  <textarea
                    id="request-body"
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-3 font-mono text-xs shadow-xs focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    placeholder='{"title": "Judul Tugas", "priority": "medium"}'
                  />
                  <p className="text-[11px] text-muted-foreground">
                    <code className="font-mono">project_id</code> bersifat opsional; sistem serverless akan otomatis meng-auto-resolve ke proyek aktif pengguna.
                  </p>
                </div>
              )}

              {/* Action Trigger Button */}
              <Button
                type="button"
                onClick={handleSendRequest}
                disabled={isLoading}
                className="w-full h-10 gap-2 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Clock className="size-4 animate-spin" />
                    <span>Mengirim Permintaan ke Serverless Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Kirim Request HTTP</span>
                  </>
                )}
              </Button>

              {errorNotice && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                  {errorNotice}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Response Inspector Panel (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="border-border/80 bg-card shadow-lg shadow-primary/5 flex flex-col min-h-[460px]">
            <CardHeader className="pb-3 border-b border-border/70">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Play className="size-4 text-emerald-500" />
                  Response Inspector
                </CardTitle>
                {responseData && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleCopyResponse}
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-500" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Salin JSON</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              <CardDescription>
                Hasil evaluasi respons dari Route Handler Next.js 16.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 flex-1 flex flex-col">
              {/* Status Header Meta */}
              <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Status:</span>
                  {responseStatus !== null ? (
                    <Badge
                      variant="outline"
                      className={`font-mono text-xs font-bold ${getStatusBadgeVariant(
                        responseStatus
                      )}`}
                    >
                      {responseStatus} {responseStatusText}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">None</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Latency:</span>
                  {latencyMs !== null ? (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {latencyMs} ms
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">-- ms</span>
                  )}
                </div>
              </div>

              {/* Preformatted JSON Content Viewport */}
              <div className="relative flex-1 rounded-lg border border-border/80 bg-muted/20 p-3 min-h-[280px] overflow-auto">
                {responseData ? (
                  <pre className="font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap break-all">
                    {responseData}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
                    <FlaskConical className="size-8 opacity-30" />
                    <p className="text-xs">
                      Belum ada permintaan yang dikirim.
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 max-w-[240px]">
                      Pilih method HTTP, pastikan Bearer Token terisi, lalu klik <strong>Kirim Request HTTP</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* RFC 7807 Quick Info Footer */}
              <Separator />
              <div className="text-[11px] text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Standar Kontrak API:</p>
                <p>• Sukses: <code className="font-mono">{"{ success: true, data: ..., meta: ... }"}</code></p>
                <p>• Error (RFC 7807): <code className="font-mono">{"{ type, title, status, detail, code, errors }"}</code></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
