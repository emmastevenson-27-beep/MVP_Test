import { NextResponse } from "next/server";

// TEMPORARY diagnostic route — not part of the spec. Reveals the stored
// Supabase URL (not sensitive) and attempts a raw fetch to it with full
// error detail, to isolate a "fetch failed" error seen from the real
// insert route. Delete once the root cause is confirmed.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const keyLength = process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0;

  let fetchResult: unknown = null;
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "" },
    });
    fetchResult = { ok: res.ok, status: res.status, statusText: res.statusText };
  } catch (err) {
    const anyErr = err as { message?: string; cause?: { message?: string; code?: string } };
    fetchResult = {
      failed: true,
      message: anyErr?.message,
      causeMessage: anyErr?.cause?.message,
      causeCode: anyErr?.cause?.code,
    };
  }

  return NextResponse.json({
    url,
    urlLength: url?.length,
    hasKey,
    keyLength,
    fetchResult,
  });
}
