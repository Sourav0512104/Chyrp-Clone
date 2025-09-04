"use client";
import { useState } from "react";

interface HelpModalProps {
  open: boolean;
  href: string | null;
  onClose: () => void;
}

export default function HelpModal({ open, href, onClose }: HelpModalProps) {
  if (!open || !href) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-3/4 h-3/4 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-1 bg-gray-200 rounded"
        >
          ✕
        </button>
        <iframe src={href} className="w-full h-full" title="Help Content" />
      </div>
    </div>
  );
}
