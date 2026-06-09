import { getSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Supabase not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("contracts")
    .select("primary_place_of_performance_state_code")
    .not("primary_place_of_performance_state_code", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const states = Array.from(
    new Set(
      (data ?? [])
        .map((r) => r.primary_place_of_performance_state_code as string)
        .filter(Boolean)
    )
  ).sort();

  return NextResponse.json({ states });
}
