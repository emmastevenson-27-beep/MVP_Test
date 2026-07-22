import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { SECTION_TABLES, getSectionColumns, getSmallintColumns, isSectionKey } from "@/lib/schema";

// Append-only inserts, per docs/restore_survey_handoff_spec.md — no upserts.
// submitted_at is left to the database default (now()); client clocks aren't trusted.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  if (!isSectionKey(section)) {
    return NextResponse.json({ error: "Unknown survey section." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { participantId, answers } = (body ?? {}) as {
    participantId?: unknown;
    answers?: unknown;
  };

  if (typeof participantId !== "string" || participantId.trim() === "") {
    return NextResponse.json({ error: "participantId is required." }, { status: 400 });
  }

  const answersObj: Record<string, unknown> =
    answers && typeof answers === "object" ? (answers as Record<string, unknown>) : {};

  const columns = getSectionColumns(section);
  const smallintColumns = getSmallintColumns(section);

  const row: Record<string, string | number | null> = {
    participant_id: participantId.trim(),
  };

  for (const col of columns) {
    if (!(col in answersObj)) continue;
    const raw = answersObj[col];

    if (smallintColumns.has(col)) {
      const num = typeof raw === "number" ? raw : parseInt(String(raw), 10);
      row[col] = Number.isInteger(num) && num >= 1 && num <= 5 ? num : null;
    } else {
      const str = typeof raw === "string" ? raw.trim() : "";
      row[col] = str === "" ? null : str;
    }
  }

  const table = SECTION_TABLES[section];
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from(table).insert(row).select("id").single();

  if (error) {
    console.error(`Failed to insert into ${table}:`, error);
    return NextResponse.json(
      { error: "Could not save response.", debug: error.message, debugCode: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
