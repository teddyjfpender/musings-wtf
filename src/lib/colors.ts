export const TAG_COLORS: Record<string, string> = {
  "prediction-markets": "#FF6B6B",
  starknet: "#4ECDC4",
  privacy: "#9B59B6",
  "ai-engineering": "#F39C12",
  "mechanism-design": "#3498DB",
  starks: "#2ECC71",
};

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || "#888888";
}

export function getPrimaryTag(tags: string[]): string {
  const priority = Object.keys(TAG_COLORS);
  for (const p of priority) {
    if (tags.includes(p)) return p;
  }
  return tags[0] || "unknown";
}
