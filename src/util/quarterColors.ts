export type Quarter = "fall" | "winter" | "spring";

export const MAX_WEEK = 10;

/** fixme: winter end date is variable depending on year.
 * not sure of better way to handle this other than querying AAPI, so just let the user
 * override with picker if needed ¯\_(ツ)_/¯
 */
const WINTER_END_MARCH_DAY = 21;

interface Palette {
  header: [string, string];
  background: [string, string];
}

/** [week 1 color, week 10 color] for each quarter */
export const QUARTER_PALETTES: Record<Quarter, Palette> = {
  fall: {
    header: ["#E8A33D", "#A8321F"],
    background: ["#FBEBCB", "#EBCDBF"],
  },
  winter: {
    header: ["#6FB3E0", "#2B3F8F"],
    background: ["#E3F1FB", "#CDD3EC"],
  },
  spring: {
    header: ["#7CCB6B", "#D44F9A"],
    background: ["#E4F5DC", "#F5D9E9"],
  },
};

export function getQuarter(date: Date = new Date()): Quarter {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  if (month === 0 || month === 1) return "winter";
  if (month === 2) return day <= WINTER_END_MARCH_DAY ? "winter" : "spring";
  if (month >= 3 && month <= 5) return "spring";
  return "fall"; // July and August can fallback to Fall
}

// Extracts week number (1-10) from header "ICS Club Events: Week xx"
export function parseWeek(text: string): number | null {
  const match = /week\s*(\d+)/i.exec(text);
  if (!match) return null;
  return Math.min(MAX_WEEK, Math.max(1, Number.parseInt(match[1], 10)));
}

function lerpHex(from: string, to: string, t: number): string {
  const channel = (hex: string, i: number) => Number.parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  let out = "#";
  for (let i = 0; i < 3; i++) {
    const value = Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * t);
    out += value.toString(16).padStart(2, "0");
  }
  return out;
}

export function getQuarterColors(quarter: Quarter, week: number | null) {
  const t = ((week ?? 1) - 1) / (MAX_WEEK - 1);
  const palette = QUARTER_PALETTES[quarter];
  return {
    header: lerpHex(palette.header[0], palette.header[1], t),
    background: lerpHex(palette.background[0], palette.background[1], t),
  };
}
