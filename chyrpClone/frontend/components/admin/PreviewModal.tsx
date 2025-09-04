"use client";

import { X } from "lucide-react";

interface PreviewModalProps {
  html: string;
  onClose: () => void;
}

export default function PreviewModal({ html, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-4/5 h-4/5 relative overflow-hidden">
        {/* Close button */}
              <button
        type="button"   // <-- add this
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        aria-label="Close preview"
      >
        <X size={20} />
      </button>


        {/* Rendered preview HTML */}
        <div
          className="p-4 overflow-y-auto h-full prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
