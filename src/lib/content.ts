import type { Note } from "./types";

let cachedNotes: Note[] | null = null;

export async function loadNotes(): Promise<Note[]> {
  if (cachedNotes) return cachedNotes;
  const res = await fetch("/content-manifest.json");
  cachedNotes = (await res.json()) as Note[];
  return cachedNotes;
}
