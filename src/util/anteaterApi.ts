import type { Quarter } from "./quarterColors";

const WEEK_URL = "https://anteaterapi.com/v2/rest/week";

export interface CurrentTerm {
  week: number | null;
  quarter: Quarter | null;
}

interface WeekResponse {
  ok: boolean;
  data?: { weeks?: number[]; quarters?: string[] };
}

export async function fetchCurrentTerm(signal?: AbortSignal): Promise<CurrentTerm> {
  const response = await fetch(WEEK_URL, { signal });
  if (!response.ok) throw new Error(`Anteater API responded with ${response.status}`);
  const body = (await response.json()) as WeekResponse;
  if (!body.ok || !body.data) throw new Error("Anteater API returned an error response");

  // e.g. "Fall Quarter 2026"
  // if it's summer, we'll just let it fallback to null and App.tsx will assume we're in Fall
  const quarterName = /\b(fall|winter|spring)\b/i.exec(body.data.quarters?.[0] ?? "")?.[1];
  return {
    week: body.data.weeks?.[0] ?? null,
    quarter: (quarterName?.toLowerCase() as Quarter | undefined) ?? null,
  };
}
