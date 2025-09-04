"use client";
import { useEffect, useState } from "react";
import { fetchUploads } from "@/lib/api";

interface UploadsModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (file: { href: string; name: string }) => void;
}

export default function UploadsModal({ open, onClose, onSelect }: UploadsModalProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (open) {
      fetchUploads().then(setHtml).catch(console.error);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-1 bg-gray-200 rounded"
        >
          ✕
        </button>
        <div
          className="prose max-h-96 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: html }}
          onClick={(e) => {
            const target = e.target as HTMLAnchorElement;
            if (target.tagName === "A") {
              e.preventDefault();
              onSelect({ href: target.href, name: target.dataset.name || "" });
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
}
