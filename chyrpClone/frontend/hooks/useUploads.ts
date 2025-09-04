import { useState } from "react";

type UploadResponse = {
  success: boolean;
  data?: { name: string; href: string; size: number };
  error?: string;
};

export function useUploads(limitMB = 10) {
  const [active, setActive] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function send(
    file: File,
    done: (res: UploadResponse) => void,
    fail: (err: any) => void,
    always: () => void
  ) {
    if (file.size > limitMB * 1_000_000) {
      setError(`Maximum file size: ${limitMB}MB`);
      fail("File too large");
      return;
    }

    setActive((n) => n + 1);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const data: UploadResponse = await res.json();
      if (data.success) done(data);
      else fail(data);
    } catch (err) {
      fail(err);
    } finally {
      setActive((n) => n - 1);
      always();
    }
  }

  return { active, error, send };
}
