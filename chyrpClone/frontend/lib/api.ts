// frontend/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:5000/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return await res.json();
}


export async function fetchUploads(search = "", filter = "") {
  const form = new FormData();
  form.append("search", search);
  form.append("filter", filter);

  const res = await fetch(`${BASE_URL}/uploads/modal`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Failed to load uploads");
  return res.text(); // backend returns HTML snippet
}
export async function previewContent(content: string, markdown: boolean = true): Promise<string> {
  const res = await fetch("http://localhost:5000/api/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, markdown }),
  });

  if (!res.ok) throw new Error("Preview request failed");
  const data = await res.json();

  if (data.success && data.html) {
    return data.html;
  } else {
    throw new Error(data.error || "Preview failed");
  }
}
