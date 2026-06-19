export function filterContent(
  text: string,
  keywords: string[]
): { allowed: boolean; reason?: string } {
  const lower = text.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      return { allowed: false, reason: `Content contains prohibited keyword` };
    }
  }
  return { allowed: true };
}
