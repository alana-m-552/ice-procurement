import { getSupabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Supabase not configured" },
      { status: 503 }
    );
  }

  const { id } = await params;
  const awardId = decodeURIComponent(id);

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("contract_transaction_unique_key", awardId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
