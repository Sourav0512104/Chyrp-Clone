// frontend/pages/admin/write.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import TextEditor, { TextEditorHandle } from "@/components/admin/TextEditor";
import AdminLayout from "@/components/admin/AdminLayout";

import TextFeather from "@/components/feathers/TextFeather";
import AudioFeather from "@/components/feathers/AudioFeather";

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
  const editorRef = useRef<TextEditorHandle>(null);

  useEffect(() => {
    async function loadFeathers() {
      try {
        const res = await fetch("http://localhost:5000/api/feathers");
        const data = await res.json();
        if (res.ok && data.feathers) {
          setFeathers(data.feathers.filter((f: Feather) => f.enabled));
        }
      } catch (err) {
        console.error("Failed to load feathers", err);
      }
    }
    loadFeathers();
  }, []);

  const featherComponents: Record<string, any> = {
    text: TextFeather,
    audio: AudioFeather,
  };

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

      {/* Form (full-width) */}
      <form className="space-y-4 max-w-5xl mx-auto w-full">
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

        <div>
          <label htmlFor="body" className="block font-medium mb-1">
            Body
          </label>
          <TextEditor
            id="body"
            name="body"
            markdown={true}
            persistKey="write_body"
            ref={editorRef}
          />
        </div>

        <div className="w-full">
          {feathers.map((f) => {
            if (activeTab === f.key && featherComponents[f.key]) {
              const FeatherComponent = featherComponents[f.key];
              return <FeatherComponent key={f.key} editorRef={editorRef} />;
            }
            return null;
          })}
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
