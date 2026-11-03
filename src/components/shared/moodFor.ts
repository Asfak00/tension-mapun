import type { Mood } from "@/types";

/** Maps a 0-100 tension value to a character expression. */
export function moodFor(value: number): Mood {
  if (value <= 20) return "chill";
  if (value <= 40) return "worried";
  if (value <= 60) return "panic";
  if (value <= 80) return "meltdown";
  return "dead";
}
