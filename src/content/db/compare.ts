export function canonicalJson(value: unknown): string {
  return JSON.stringify(normalizeForJsonComparison(value));
}

function normalizeForJsonComparison(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForJsonComparison);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([entryKey, entryValue]) => [
          entryKey,
          normalizeForJsonComparison(entryValue),
        ]),
    );
  }

  return value;
}
