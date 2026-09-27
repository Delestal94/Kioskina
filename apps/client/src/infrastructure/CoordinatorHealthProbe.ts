export type CoordinatorAvailability = "checking" | "available" | "unavailable";

export async function checkCoordinatorAvailability(
  apiUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<CoordinatorAvailability> {
  try {
    const response = await fetcher(`${apiUrl}/health`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) return "unavailable";
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && "status" in body && body.status === "ok"
      ? "available"
      : "unavailable";
  } catch {
    return "unavailable";
  }
}
