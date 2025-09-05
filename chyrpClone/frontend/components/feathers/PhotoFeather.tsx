"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/api";
import { TextEditorHandle } from "@/components/admin/TextEditor";

type Props = {
  editorRef: React.RefObject<TextEditorHandle>; // shared body editor from WritePage
  title: string;                                // shared title (used only for alt text)
};

export default function PhotoFeather({ editorRef, title }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // File upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { href } = await uploadFile(file);
      setPhotoUrl(href);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  // Insert uploaded photo into the shared body editor
  const insertPhoto = () => {
    if (!photoUrl) return alert("Please upload a photo first.");
    if (!editorRef.current) return alert("Editor is not ready.");

      const fullUrl = photoUrl?.startsWith("http")
      ? photoUrl
      : `http://127.0.0.1:5000${photoUrl}`;

    editorRef.current.insertAtCaret(
      `<img src="${fullUrl}" alt="${title || "Photo"}" />\n`
    );

  };

  return (
    <div className="space-y-6 p-4 border rounded bg-gray-50">
      {/* Photo upload */}
      <div>
        <label className="block font-medium mb-1">Photo</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="photo-file"
          />
          <label
            htmlFor="photo-file"
            className="px-3 py-1 border rounded cursor-pointer bg-white"
          >
            Choose file
          </label>
          {photoUrl && <span className="text-sm text-green-600">Uploaded ✓</span>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPhotoUrl(null)}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={insertPhoto}
            className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() =>
              photoUrl
                ? alert("File is already uploaded to server.")
                : alert("Upload a photo first.")
            }
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
