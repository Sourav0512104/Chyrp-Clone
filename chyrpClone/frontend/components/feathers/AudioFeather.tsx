"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/api";
import { TextEditorHandle } from "@/components/admin/TextEditor";

type Props = {
  editorRef: React.RefObject<TextEditorHandle>;  // ✅ RefObject, not nullable
  persistKey?: string;
};

export default function AudioFeather({ editorRef }: Props) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [captionUrl, setCaptionUrl] = useState<string | null>(null);

  // Upload handler
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadFile(file);
      const href = res.data?.href;
      if (href) {
        setUrl(href);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    }
  };

  // Insert uploaded audio into editor
  const handleInsertAudio = () => {
    if (!audioUrl) return alert("Please upload an audio file first.");
    if (!editorRef.current) return alert("Editor is not ready."); // ✅ should now work

    editorRef.current.insertAtCaret(
      `<audio controls src="${audioUrl}"></audio>\n`
    );
    if (captionUrl) {
      editorRef.current.insertAtCaret(
        `<track src="${captionUrl}" kind="captions" />\n`
      );
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded bg-gray-50">
      {/* --- Audio file upload --- */}
      <div>
        <label className="block font-medium mb-1">Audio File</label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleUpload(e, setAudioUrl)}
            className="hidden"
            id="audio-file"
          />
          <label
            htmlFor="audio-file"
            className="px-3 py-1 border rounded cursor-pointer bg-white"
          >
            Choose File
          </label>
          {audioUrl && <span className="text-sm text-green-600">Uploaded ✓</span>}
        </div>
      </div>

      {/* --- Captions upload --- */}
      <div>
        <label className="block font-medium mb-1">Captions</label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".vtt,.srt"
            onChange={(e) => handleUpload(e, setCaptionUrl)}
            className="hidden"
            id="caption-file"
          />
          <label
            htmlFor="caption-file"
            className="px-3 py-1 border rounded cursor-pointer bg-white"
          >
            Choose File
          </label>
          {captionUrl && <span className="text-sm text-green-600">Uploaded ✓</span>}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setAudioUrl(null);
            setCaptionUrl(null);
          }}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleInsertAudio}
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Insert
        </button>
        <button
          type="button"
          onClick={() => {
            if (!audioUrl) return alert("Upload an audio file first.");
            alert("File is already uploaded to server.");
          }}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
