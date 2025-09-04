"use client";

import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function MarkdownHelpModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-3xl h-4/5 overflow-y-auto relative p-6">
        {/* Close button */}
                <button
        type="button"   // <-- add this
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        aria-label="Close preview"
        >
        <X size={20} />
        </button>


        <h2 className="text-2xl font-bold mb-4">Markdown</h2>
        <p className="mb-4">
          Markdown is a syntax for writing structured documents in plain text.
          Here are the basics to get you started:
        </p>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Markdown</th>
              <th className="border p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">### Heading</td>
              <td className="border p-2"><strong>Heading</strong></td>
            </tr>
            <tr>
              <td className="border p-2">**Strong**</td>
              <td className="border p-2 font-bold">Strong</td>
            </tr>
            <tr>
              <td className="border p-2">*Emphasis*</td>
              <td className="border p-2 italic">Emphasis</td>
            </tr>
            <tr>
              <td className="border p-2">~~Strikethrough~~</td>
              <td className="border p-2 line-through">Strikethrough</td>
            </tr>
            <tr>
              <td className="border p-2">`Code`</td>
              <td className="border p-2"><code>Code</code></td>
            </tr>
            <tr>
              <td className="border p-2">[title](URL)</td>
              <td className="border p-2 text-blue-600 underline">Hyperlink</td>
            </tr>
            <tr>
              <td className="border p-2">- List item</td>
              <td className="border p-2">• List item</td>
            </tr>
            <tr>
              <td className="border p-2">&gt; Blockquote</td>
              <td className="border p-2 italic">Blockquote</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
