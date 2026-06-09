import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_SORTS = new Set([
  "action_date",
  "federal_action_obligation",
  "recipient_name",
  "primary_place_of_performance_state_code",
  "award_type",
  "action_type",
]);

const VALID_CONFIDENCE = new Set(["high", "medium", "low"]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    200,
    Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50)
  );
  const search = searchParams.get("search")?.trim() || "";
  const state = searchParams.get("state")?.trim() || "";
  const awardType = searchParams.get("award_type")?.trim() || "";
  const actionType = searchParams.get("action_type")?.trim() || "";
  const surveillanceOnly = searchParams.get("surveillance_only") === "true";
  const confidenceParam = searchParams.get("confidence")?.trim() || "";
  const sortParam = searchParams.get("sort")?.trim() || "action_date";
  const sort = ALLOWED_SORTS.has(sortParam) ? sortParam : "action_date";
  const order =
    (searchParams.get("order") || "desc").toLowerCase() === "asc"
      ? "asc"
      : "desc";

  let query = supabase
    .from("contracts")
    .select("*", { count: "exact" });

  if (search) {
    // case-insensitive match across description OR recipient name
    const escaped = search.replace(/[%,]/g, " ");
    query = query.or(
      `transaction_description.ilike.%${escaped}%,recipient_name.ilike.%${escaped}%`
    );
  }

  if (state) {
    query = query.eq("primary_place_of_performance_state_code", state);
  }

  if (awardType) {
    query = query.eq("award_type", awardType);
  }

  if (actionType) {
    query = query.eq("action_type", actionType);
  }

  if (surveillanceOnly) {
    query = query.eq("is_surveillance", true);
  }

  if (confidenceParam) {
    const levels = confidenceParam
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter((c) => VALID_CONFIDENCE.has(c));
    if (levels.length > 0) {
      query = query.in("surveillance_confidence", levels);
    }
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query
    .order(sort, { ascending: order === "asc", nullsFirst: false })
    .range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    data: data ?? [],
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}
