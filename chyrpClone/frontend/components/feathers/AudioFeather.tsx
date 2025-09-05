"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/api";
import { TextEditorHandle } from "@/components/admin/TextEditor";

type Props = {
  editorRef: React.RefObject<TextEditorHandle>;
  persistKey?: string;
};

export default function AudioFeather({ editorRef }: Props) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [captionFile, setCaptionFile] = useState<File | null>(null);
  const [captionUrl, setCaptionUrl] = useState<string | null>(null);

  // --- Upload helpers ---
  const handleUpload = async (file: File, setUrl: (url: string) => void) => {
    try {
      const res = await uploadFile(file);
      const href = res.href;
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

  // --- Insert audio ---
 const insertAudio = () => {
  if (!audioUrl) return alert("Please upload an audio file first.");
  if (!editorRef.current) return alert("Editor is not ready.");

  // Ensure we point to backend correctly
  const fullUrl = audioUrl.startsWith("http")
    ? audioUrl
    : `http://127.0.0.1:5000${audioUrl}`;

  editorRef.current.insertAtCaret(`<audio controls src="${fullUrl}"></audio>\n`);
};


  // --- Insert captions ---
  const insertCaptions = () => {
    if (!captionUrl) return alert("Please upload a captions file first.");
    if (!editorRef.current) return alert("Editor is not ready.");
        const fullCaptionUrl = captionUrl?.startsWith("http")
      ? captionUrl
      : `http://127.0.0.1:5000${captionUrl}`;

    editorRef.current.insertAtCaret(
      `<track src="${fullCaptionUrl}" kind="captions" />\n`
    );

  };

  return (
    <div className="space-y-6 p-4 border rounded bg-gray-50">
      {/* --- Audio file controls --- */}
      <div>
        <label className="block font-medium mb-1">Audio File</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
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
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setAudioFile(null);
              setAudioUrl(null);
            }}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={insertAudio}
            disabled={!audioUrl}
            className={`px-4 py-2 border rounded ${
              audioUrl
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => audioFile && handleUpload(audioFile, setAudioUrl)}
            disabled={!audioFile}
            className={`px-4 py-2 border rounded ${
              audioFile
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* --- Captions controls --- */}
      <div>
        <label className="block font-medium mb-1">Captions File</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            accept=".vtt,.srt"
            onChange={(e) => setCaptionFile(e.target.files?.[0] || null)}
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
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setCaptionFile(null);
              setCaptionUrl(null);
            }}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={insertCaptions}
            disabled={!captionUrl}
            className={`px-4 py-2 border rounded ${
              captionUrl
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => captionFile && handleUpload(captionFile, setCaptionUrl)}
            disabled={!captionFile}
            className={`px-4 py-2 border rounded ${
              captionFile
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
