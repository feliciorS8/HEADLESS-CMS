import { NextResponse } from "next/server";

/**
 * Standard CORS Headers untuk Klien Mobile (Flutter / React Native)
 * dan Integrasi Sistem Eksternal.
 */
export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: ApiMeta;
};

/**
 * Struktur Error Terstandarisasi Spesifikasi IETF RFC 7807 (Problem Details for HTTP APIs)
 */
export type ApiErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  errors?: Record<string, string[]>;
};

const STATUS_TITLES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
};

/**
 * Pembungkus respons sukses API terstandarisasi dengan header CORS
 */
export function apiSuccess<T>(
  data: T,
  meta?: ApiMeta,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };

  return NextResponse.json(body, {
    status,
    headers: corsHeaders,
  });
}

/**
 * Pembungkus respons error API terstandarisasi sesuai IETF RFC 7807
 */
export function apiError(
  detail: string,
  code = "BAD_REQUEST",
  status = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
  const title = STATUS_TITLES[status] || "API Request Error";
  const body: ApiErrorResponse = {
    type: `https://api.serverless-odyssey.dev/errors/${code.toLowerCase().replace(/_/g, "-")}`,
    title,
    status,
    detail,
    code,
    ...(errors ? { errors } : {}),
  };

  return NextResponse.json(body, {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/problem+json",
    },
  });
}

