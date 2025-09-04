"use client";

import { useState, useEffect } from "react";
import { TextEditorHandle } from "@/components/admin/TextEditor";

type Props = {
  editorRef: React.RefObject<TextEditorHandle>;
  onRegister?: (saveFn: () => Promise<void>) => void;
};

export default function TextFeather({ editorRef, onRegister }: Props) {
  const [status, setStatus] = useState("published");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const body = editorRef.current?.getValue?.() || "";

      const res = await fetch("/api/feathers/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, status }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Post saved successfully!");
      } else {
        setMessage(data.error || "Failed to save post.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // Register saveFn with parent (WritePage)
  useEffect(() => {
    if (onRegister) onRegister(handleSubmit);
  }, [onRegister, status]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="status" className="block font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="private">Private</option>
        </select>
      </div>

      {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
    </div>
  );
}
