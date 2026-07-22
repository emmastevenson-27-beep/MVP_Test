import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { SECTION_TABLES } from "@/lib/schema";
import { SECTION_ORDER } from "@/lib/surveyConfig";

// Vercel Cron triggers this route on the schedule in vercel.json (GET request).
// It's also safe to hit manually (e.g. from the browser or curl) to force a sync.
export const maxDuration = 60;

async function fetchAllRows(table: string): Promise<Record<string, unknown>[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("*")
    .order("submitted_at", { ascending: true });

  if (error) throw new Error(`Failed to read ${table}: ${error.message}`);
  return data ?? [];
}

function rowsToGrid(rows: Record<string, unknown>[]): string[][] {
  if (rows.length === 0) return [[]];
  const headers = Object.keys(rows[0]);
  const grid: string[][] = [headers];
  for (const row of rows) {
    grid.push(
      headers.map((h) => {
        const v = row[h];
        return v === null || v === undefined ? "" : String(v);
      })
    );
  }
  return grid;
}

export async function GET(request: NextRequest) {
  // Optional: if CRON_SECRET is set, require it as a bearer token. Vercel
  // automatically sends this header for its own cron invocations; it's not
  // one of the spec's required env vars, so the check is skipped entirely
  // if you don't set one.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!sheetId || !clientEmail || !privateKeyRaw) {
    return NextResponse.json(
      { error: "Missing Google Sheets environment variables." },
      { status: 500 }
    );
  }

  // Vercel env vars can't store literal newlines cleanly, so the private key
  // is stored with escaped \n sequences and unescaped here.
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const results: Record<string, number> = {};

  try {
    for (const section of SECTION_ORDER) {
      const table = SECTION_TABLES[section];
      const rows = await fetchAllRows(table);
      const grid = rowsToGrid(rows);

      // Tab name must match the section key exactly (onboarding / midprogram / endprogram).
      await sheets.spreadsheets.values.clear({
        spreadsheetId: sheetId,
        range: `${section}!A:ZZ`,
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${section}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: grid },
      });

      results[section] = rows.length;
    }

    return NextResponse.json({ ok: true, synced: results, syncedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Sheet sync failed:", err);
    return NextResponse.json(
      { error: "Sheet sync failed.", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
