"use client";

import { useState, useEffect, useRef } from "react";
import TextEditor, { TextEditorHandle } from "@/components/admin/TextEditor";
import AdminLayout from "@/components/admin/AdminLayout";
import LinkFeather from "@/components/feathers/LinkFeather";
import TextFeather from "@/components/feathers/TextFeather";
import AudioFeather from "@/components/feathers/AudioFeather";
import PhotoFeather from "@/components/feathers/PhotoFeather";
import QuoteFeather from "@/components/feathers/QuoteFeather";

type Feather = {
  id: number;
  key: string;
  name: string;
  enabled: boolean;
};

export default function WritePage() {
  const [activeTab, setActiveTab] = useState("page");
  const [title, setTitle] = useState("");
  const [feathers, setFeathers] = useState<Feather[]>([]);

const editorRef = useRef<TextEditorHandle | null>(null);
const quoteSourceRef = useRef<TextEditorHandle | null>(null);

  useEffect(() => {
    async function loadFeathers() {
      const res = await fetch("http://localhost:5000/api/feathers");
      const data = await res.json();
      setFeathers((data.feathers || []).filter((f: Feather) => f.enabled));
    }
    loadFeathers();
  }, []);

  // Components for feathers that use the shared editorRef.
  // (Quote is purposely excluded because it has a special layout.)
  const featherComponents: Record<string, any> = {
    text: TextFeather,
    audio: AudioFeather,
    link: LinkFeather,
    photo: PhotoFeather,
    // quote handled separately below
  };

  // Label for the shared editor, per feather (not used for Quote)
  const sharedLabel =
    activeTab === "text" || activeTab === "page"
      ? "Body"
      : activeTab === "audio" || activeTab === "video" || activeTab === "link"
      ? "Description"
      : "Captions";

  return (
    <AdminLayout>
      {/* Sub-tabs under Write */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab("page")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "page"
              ? "bg-white border border-b-0 border-gray-300 font-semibold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Page
        </button>

        {feathers.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveTab(f.key)}
            className={`px-4 py-2 rounded-t-md ${
              activeTab === f.key
                ? "bg-white border border-b-0 border-gray-300 font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Form */}
      <form className="space-y-4 max-w-5xl mx-auto w-full">
        {/* Title – hidden for Quote (quote has no title in Chyrp Lite) */}
        {activeTab !== "quote" && (
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        )}

        {/* Shared body/captions editor – always mounted, but hidden for Quote */}
<div className={activeTab === "quote" ? "hidden" : ""}>
  <label htmlFor="body" className="block font-medium mb-1">
    {sharedLabel}
  </label>
  <TextEditor
    id="body"
    name="body"
    markdown={true}
    persistKey="write_body"
    ref={editorRef}
  />
</div>

{/* Feather-specific area */}
<div className="w-full">
 {activeTab === "quote" ? (
  <QuoteFeather
    editorRef={editorRef}
    sourceRef={quoteSourceRef}
    onQuoteChange={(val: string) => {
      // 🔑 overwrite global body so it propagates back
      if (editorRef.current) {
        editorRef.current.setValue(val);
      }
    }}
  />
) : (
  feathers.map((f) => {
    if (activeTab === f.key && featherComponents[f.key]) {
      const FeatherComponent = featherComponents[f.key];
      return <FeatherComponent key={f.key} editorRef={editorRef} />;
    }
    return null;
  })
)}
</div>


        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </AdminLayout>
  );
}
