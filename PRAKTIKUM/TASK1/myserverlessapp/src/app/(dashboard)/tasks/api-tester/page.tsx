import Link from "next/link";
import { ArrowLeft, FlaskConical, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiTesterPage() {
  return (
    <div className="w-full max-w-4xl space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke Dashboard
        </Link>
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3 text-primary" />
          Tahap 2: API Tester Ready
        </Badge>
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FlaskConical className="size-5 text-primary" />
            <CardTitle>API Tester Tugas Internal</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Halaman pengujian endpoint API dan integrasi eksternal untuk arsitektur serverless.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Modul pengujian API akan dikembangkan pada Tahap 2 untuk menguji interaksi endpoint Serverless, simulasi kueri pagination, dan pengujian otorisasi token secara komprehensif.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

