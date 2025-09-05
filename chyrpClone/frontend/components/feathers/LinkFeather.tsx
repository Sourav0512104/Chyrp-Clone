"use client";

import { useState } from "react";
import { TextEditorHandle } from "@/components/admin/TextEditor";

export default function LinkFeather({ editorRef }: { editorRef: React.RefObject<TextEditorHandle> }) {
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-4">
      {/* URL only */}
      <div>
        <label htmlFor="url" className="block font-medium mb-1">URL</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="https://example.com"
        />
      </div>
    </div>
  );
}
