// Simple helper to keep fetch() targets consistent.
export function useApiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE || "";
  return (path: string) => `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
