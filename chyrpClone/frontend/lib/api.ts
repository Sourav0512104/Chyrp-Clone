// frontend/lib/api.ts
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

/** Normalized shape you can rely on in the UI */
export type NormalizedUpload = {
  href: string;     // /api/uploads/<filename> (or absolute URL if your backend returns it)
  name?: string;    // original filename (if backend includes it)
  raw: any;         // full raw JSON response (for debugging)
};

/**
 * Upload a single file to the backend generic uploads endpoint.
 * Your Flask route at POST /api/uploads should exist and return JSON.
 */
export async function uploadFile(file: File): Promise<NormalizedUpload> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/uploads`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  // Accept either { href } or { success: true, data: { href, name } }
  const href: string | undefined = json?.href ?? json?.data?.href;
  const name: string | undefined = json?.data?.name;

  if (!href) throw new Error("Upload response missing 'href'.");

  return { href, name, raw: json };
}

/** Optional helpers you already use elsewhere */
export async function fetchUploads(search = "", filter = ""): Promise<string> {
  const form = new FormData();
  form.append("search", search);
  form.append("filter", filter);

  const res = await fetch(`${BASE_URL}/uploads/modal`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load uploads");
  return res.text();
}

export async function previewContent(
  content: string,
  markdown: boolean = true
): Promise<string> {
  const res = await fetch(`${BASE_URL}/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, markdown }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Preview request failed");
  const data = await res.json();

  if (data.success && data.html) return data.html;
  throw new Error(data.error || "Preview failed");
}
